'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { ScoredCandidate } from '@/types';
import { getScoreColor, getRecommendationLabel, getRecommendationBadgeClass } from '@/lib/utils';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const DEFAULT_FORM = {
  name: '',
  age: '',
  city: '',
  school: '',
  gpa: '',
  essay: '',
  experience: '',
  achievements: '',
  languages: '',
  videoStatement: false,
  references: '1',
  extracurricular: '',
};

export default function SubmitPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [result, setResult] = useState<ScoredCandidate | null>(null);
  const [scoring, setScoring] = useState(false);
  const [autoScore, setAutoScore] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const buildCandidate = () => ({
    id: `live-${Date.now()}`,
    name: form.name || 'Anonymous Applicant',
    age: parseInt(form.age) || 18,
    city: form.city || 'Unknown',
    school: form.school || 'Unknown',
    gpa: parseFloat(form.gpa) || 3.0,
    submittedAt: new Date().toISOString().split('T')[0],
    essay: form.essay,
    experience: form.experience.split('\n').filter(Boolean),
    achievements: form.achievements.split('\n').filter(Boolean),
    languages: form.languages.split(',').map(l => l.trim()).filter(Boolean),
    socialLinks: {},
    videoStatement: form.videoStatement,
    references: parseInt(form.references) || 1,
    extracurricular: form.extracurricular,
  });

  const scoreNow = useCallback(async () => {
    if (!form.essay || form.essay.length < 30) return;
    setScoring(true);
    const candidate = buildCandidate();
    const res = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate }),
    });
    const data = await res.json();
    if (data.success) setResult(data.data);
    setScoring(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Auto-score with debounce
  useEffect(() => {
    if (!autoScore || !form.essay || form.essay.length < 30) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    const t = setTimeout(scoreNow, 1200);
    setDebounceTimer(t);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, autoScore]);

  const radarData = result ? [
    { dim: 'Leadership', score: result.scores.leadership.score },
    { dim: 'Motivation', score: result.scores.motivation.score },
    { dim: 'Growth', score: result.scores.growth.score },
    { dim: 'Comm.', score: result.scores.communication.score },
    { dim: 'Velocity', score: result.scores.growthVelocity.score },
  ] : [];

  const wordCount = form.essay.split(/\s+/).filter(Boolean).length;
  const essayStrength = wordCount >= 200 ? 'strong' : wordCount >= 100 ? 'medium' : 'weak';

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-display font-bold text-slate-800 mb-1">
              Live <span className="gradient-text">Scoring Preview</span>
            </h1>
            <p className="text-slate-600 text-sm">Fill in the form and see your AI score update in real-time. Test your application before submitting.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* FORM */}
            <div className="space-y-4 animate-fade-in-up delay-100">

              {/* Auto-score toggle */}
              <div className="flex items-center justify-between glass-card-static p-4">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Live Scoring</div>
                  <div className="text-xs text-slate-600">Score updates as you type (every 1.2s)</div>
                </div>
                <button onClick={() => setAutoScore(!autoScore)}
                  className={`relative w-11 h-6 rounded-full transition-all duration-300 ${autoScore ? 'bg-brand-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${autoScore ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Basic Info */}
              <div className="glass-card-static p-5">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Full Name</label>
                    <input className="input-field" placeholder="Айгерим Казанбаева" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Age</label>
                    <input className="input-field" type="number" placeholder="17" value={form.age}
                      onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">City</label>
                    <input className="input-field" placeholder="Алматы" value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">GPA (out of 5)</label>
                    <input className="input-field" type="number" step="0.1" placeholder="4.5" value={form.gpa}
                      onChange={e => setForm(f => ({ ...f, gpa: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-600 mb-1 block">School</label>
                    <input className="input-field" placeholder="НИШ Алматы" value={form.school}
                      onChange={e => setForm(f => ({ ...f, school: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Essay */}
              <div className="glass-card-static p-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-800">Motivation Essay *</label>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-600">{wordCount} words</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${
                      essayStrength === 'strong' ? 'text-emerald-400 bg-emerald-400/10' :
                      essayStrength === 'medium' ? 'text-yellow-400 bg-yellow-400/10' :
                      'text-red-400 bg-red-400/10'
                    }`}>
                      {essayStrength === 'strong' ? '✓ Strong' : essayStrength === 'medium' ? '~ Medium' : '✗ Too short'}
                    </span>
                  </div>
                </div>
                <textarea
                  className="input-field"
                  rows={10}
                  placeholder="Tell us your story. Who are you? What have you built or changed? What drives you? Why inVision U? (minimum 200 words recommended)"
                  value={form.essay}
                  onChange={e => setForm(f => ({ ...f, essay: e.target.value }))}
                />
              </div>

              {/* Experience & Achievements */}
              <div className="glass-card-static p-5">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">Experience & Achievements</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Experience (one per line)</label>
                    <textarea className="input-field" rows={3} placeholder="Founder of XYZ project&#10;Intern at Company&#10;Club organizer"
                      value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Achievements (one per line)</label>
                    <textarea className="input-field" rows={2} placeholder="1st place olympiad&#10;National grant recipient"
                      value={form.achievements} onChange={e => setForm(f => ({ ...f, achievements: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 mb-1 block">Languages (comma-sep.)</label>
                      <input className="input-field" placeholder="Kazakh, Russian, English"
                        value={form.languages} onChange={e => setForm(f => ({ ...f, languages: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 mb-1 block">References</label>
                      <input className="input-field" type="number" min="0" max="5"
                        value={form.references} onChange={e => setForm(f => ({ ...f, references: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="video" checked={form.videoStatement}
                      onChange={e => setForm(f => ({ ...f, videoStatement: e.target.checked }))}
                      className="w-4 h-4 accent-brand-500" />
                    <label htmlFor="video" className="text-sm text-slate-600">I will submit a video statement</label>
                  </div>
                </div>
              </div>

              {/* Score Button */}
              <button onClick={scoreNow} disabled={scoring || !form.essay || form.essay.length < 30}
                className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {scoring ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scoring...
                  </span>
                ) : '⚡ Score My Application'}
              </button>
            </div>

            {/* LIVE RESULT */}
            <div className="animate-fade-in-up delay-200">
              {scoring && (
                <div className="glass-card p-8 text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-400 border-t-transparent animate-spin mx-auto mb-4" />
                  <p className="text-slate-600">AI is analyzing your application...</p>
                </div>
              )}

              {!scoring && !result && (
                <div className="glass-card p-10 text-center">
                  <div className="text-5xl mb-4 opacity-30">⚡</div>
                  <p className="text-slate-600 text-sm">Your score will appear here.<br />Write your essay and click &quot;Score My Application&quot;.</p>
                  {autoScore && form.essay.length > 30 && (
                    <p className="text-brand-600 text-xs mt-3 animate-pulse">Live scoring active — waiting for you to pause...</p>
                  )}
                </div>
              )}

              {!scoring && result && (
                <div className="space-y-4 animate-fade-in">
                  {/* Score Display */}
                  <div className="glass-card p-6 text-center bg-white"
                    style={{ borderColor: getScoreColor(result.totalScore) + '40', boxShadow: `0 0 30px ${getScoreColor(result.totalScore)}18` }}>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Your Score</div>
                    <div className="text-7xl font-display font-bold mb-2"
                      style={{ color: getScoreColor(result.totalScore) }}>
                      {result.totalScore}
                    </div>
                    <div className="text-slate-500 text-sm mb-3">out of 100</div>
                    <span className={`text-sm font-semibold px-4 py-2 rounded-xl ${getRecommendationBadgeClass(result.shortlistRecommendation)}`}>
                      {getRecommendationLabel(result.shortlistRecommendation)}
                    </span>
                  </div>

                  {/* Radar */}
                  <div className="glass-card p-5 bg-white">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3">Your Profile Radar</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(0,0,0,0.08)" />
                          <PolarAngleAxis dataKey="dim" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                          <Radar dataKey="score" stroke="#3b5cff" fill="#3b5cff" fillOpacity={0.25} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Dimension Scores */}
                  <div className="glass-card p-5 bg-white">
                    <h4 className="text-sm font-semibold text-slate-800 mb-4">Score Breakdown</h4>
                    <div className="space-y-3">
                      {Object.entries(result.scores)
                        .filter(([k]) => k !== 'aiSuspicion')
                        .map(([key, dim]) => (
                        <div key={key}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600">{dim.label}</span>
                            <span style={{ color: getScoreColor(dim.score) }} className="font-mono font-bold">{dim.score}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-200">
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${dim.score}%`, background: getScoreColor(dim.score) }} />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{dim.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Flags & Questions */}
                  {result.flags.length > 0 && (
                    <div className="glass-card p-5 bg-white">
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">Flags</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.flags.map((f, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-lg"
                            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#64748b' }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.smartQuestions.length > 0 && (
                    <div className="glass-card p-5 bg-white">
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">Interview Questions You May Face</h4>
                      <div className="space-y-2">
                        {result.smartQuestions.map((q, i) => (
                          <div key={i} className="text-sm text-slate-700 p-3 rounded-lg border border-brand-100"
                            style={{ background: 'rgba(59,92,255,0.05)' }}>
                            <span className="text-brand-600 font-bold">Q{i+1}: </span>{q}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
