'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Navbar from '@/components/Navbar';
import { ScoredCandidate } from '@/types';
import { getScoreColor, getRecommendationLabel, getRecommendationBadgeClass } from '@/lib/utils';
import { getEssayHeatmap } from '@/lib/scoring/engine';
import { useLanguage } from '@/lib/i18n/LanguageContext';

function ScoreBar({ score, label, explanation }: { score: number; label: string; explanation: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <button onClick={() => setExpanded(!expanded)} className="text-sm font-medium text-slate-800 dark:text-white hover:text-brand-500 dark:hover:text-brand-300 transition-colors flex items-center gap-1">
          {label}
          <span className="text-slate-500 dark:text-slate-400 text-xs">{expanded ? '▲' : '▼'}</span>
        </button>
        <span className="font-mono font-bold text-sm" style={{ color: getScoreColor(score) }}>{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, background: `linear-gradient(90deg, ${getScoreColor(score)}88, ${getScoreColor(score)})` }}
        />
      </div>
      {expanded && (
        <div className="mt-2 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 animate-fade-in bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10">
          {explanation}
        </div>
      )}
    </div>
  );
}

function EssayHeatmap({ essay }: { essay: string }) {
  const segments = getEssayHeatmap(essay);
  return (
    <div className="leading-relaxed text-sm text-slate-700 dark:text-slate-300 space-y-1">
      {segments.map((seg, i) => {
        const level = seg.suspicion >= 60 ? 3 : seg.suspicion >= 30 ? 2 : seg.suspicion >= 10 ? 1 : 0;
        const title = seg.suspicion >= 60 ? '🔴 High AI suspicion' : seg.suspicion >= 30 ? '🟡 Moderate AI signal' : '';
        return (
          <span
            key={i}
            className={`heat-${level}`}
            title={title}
            style={{ padding: level > 0 ? '1px 2px' : undefined }}
          >
            {seg.text}{' '}
          </span>
        );
      })}
    </div>
  );
}

export default function CandidatePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [sc, setSc] = useState<ScoredCandidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'ai_heatmap' | 'questions' | 'evidence'>('overview');
  const [committeeNote, setCommitteeNote] = useState('');
  const [decision, setDecision] = useState<'shortlist' | 'hold' | 'pass' | null>(null);
  const [blindMode, setBlindMode] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/candidates/${params.id}`)
      .then(r => r.json())
      .then(d => { setSc(d.data); setLoading(false); });
  }, [params.id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
      </div>
    </>
  );

  if (!sc) return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 flex items-center justify-center text-slate-500 dark:text-slate-400">
        Candidate not found.
      </div>
    </>
  );

  const radarData = [
    { dim: t('metric_leadership'), score: sc.scores.leadership.score },
    { dim: t('metric_motivation'), score: sc.scores.motivation.score },
    { dim: t('metric_growth'), score: sc.scores.growth.score },
    { dim: t('metric_communication'), score: sc.scores.communication.score },
    { dim: t('metric_velocity'), score: sc.scores.growthVelocity.score },
  ];

  const TABS = [
    { id: 'overview', label: t('cand_overview') },
    { id: 'ai_heatmap', label: t('cand_ai_heatmap') },
    { id: 'questions', label: t('cand_smart_questions') },
    { id: 'evidence', label: t('cand_evidence') },
  ] as const;

  const decisionColors = {
    shortlist: { bg: 'rgba(5,150,105,0.15)', border: 'rgba(52,211,153,0.4)', text: '#34d399' },
    hold: { bg: 'rgba(217,119,6,0.15)', border: 'rgba(251,191,36,0.4)', text: '#fbbf24' },
    pass: { bg: 'rgba(220,38,38,0.15)', border: 'rgba(248,113,113,0.4)', text: '#f87171' },
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Back nav */}
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm flex items-center gap-1 transition-colors">
              ← Back
            </button>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-600 dark:text-slate-400 text-sm">Candidate #{sc.rank}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT: Profile Card */}
            <div className="lg:col-span-1 flex flex-col gap-4">

              {/* Security Alerts */}
              {sc.securityFlags && sc.securityFlags.length > 0 && (
                <div className="p-5 rounded-2xl animate-fade-in-up bg-red-50 border-2 border-red-200 dark:bg-red-950 dark:border-red-800">
                  <h3 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-2">🚨 Critical Security Alert</h3>
                  <div className="flex flex-col gap-2">
                    {sc.securityFlags.map((sf, i) => (
                      <div key={i} className="text-sm text-red-700 dark:text-red-300 font-medium bg-red-100/50 dark:bg-red-900/50 p-2 rounded-lg">
                        {sf}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Header */}
              <div className="glass-card p-6 animate-fade-in-up">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #3b5cff, #7c3aed)' }}>
                    {blindMode ? `#${sc.rank}` : sc.candidate.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Rank</div>
                    <div className="text-2xl font-display font-bold text-slate-800 dark:text-white">#{sc.rank}</div>
                  </div>
                </div>

                <h2 className="text-lg font-display font-bold text-slate-800 dark:text-white mb-1">
                  {blindMode ? `Candidate #${sc.rank}` : sc.candidate.name}
                </h2>
                {!blindMode && (
                  <div className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                    {sc.candidate.city} · {sc.candidate.age} years · GPA {sc.candidate.gpa}
                  </div>
                )}
                {!blindMode && (
                  <div className="text-xs text-slate-500 mb-4 pb-4 border-b border-slate-200 dark:border-white/5">
                    {sc.candidate.school}
                  </div>
                )}

                {/* Total Score */}
                <div className="text-center py-4">
                  <div className="text-5xl font-display font-bold mb-1"
                    style={{ color: getScoreColor(sc.totalScore) }}>
                    {sc.totalScore}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm">{t('cand_total_score')}</div>
                  <div className="mt-2 text-xs text-slate-500">{sc.cohortPercentile}{t('cand_percentile')}</div>
                </div>

                {/* Recommendation */}
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider text-center mt-4 mb-2">{t('cand_ai_rec')}</div>
                <div className={`text-center py-2 rounded-xl font-semibold text-sm ${getRecommendationBadgeClass(sc.shortlistRecommendation)}`}>
                  {getRecommendationLabel(sc.shortlistRecommendation)}
                </div>
              </div>

              {/* Quick Facts */}
              <div className="glass-card p-5 animate-fade-in-up delay-100">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('cand_profile_details')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">📹 Video</span>
                    <span className={sc.candidate.videoStatement ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                      {sc.candidate.videoStatement ? t('cand_submitted') : t('cand_not_submitted')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">👤 References</span>
                    <span className="text-slate-800 dark:text-white">{sc.candidate.references}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">🌐 Languages</span>
                    <span className="text-slate-800 dark:text-white text-right text-xs">{sc.candidate.languages?.slice(0,2).join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">📅 Submitted</span>
                    <span className="text-slate-800 dark:text-white text-xs">{sc.candidate.submittedAt}</span>
                  </div>
                </div>
              </div>

              {/* Flags */}
              {sc.flags.length > 0 && (
                <div className="glass-card p-5 animate-fade-in-up delay-200">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('cand_flags')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {sc.flags.map((f, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Committee Decision */}
              <div className="glass-card p-5 animate-fade-in-up delay-300 border-2 border-brand-400 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-brand-400 text-black px-3 py-1 rounded-bl-lg text-xs font-bold">Обязательно</div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">
                  {t('cand_committee_verdict')} <span className="text-brand-600">(Human)</span>
                </h3>
                <div className="flex gap-2 mb-3">
                  {(['shortlist', 'hold', 'pass'] as const).map(d => (
                    <button key={d} onClick={() => setDecision(decision === d ? null : d)}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize"
                      style={decision === d && decisionColors[d] ? {
                        background: decisionColors[d].bg,
                        border: `1px solid ${decisionColors[d].border}`,
                        color: decisionColors[d].text,
                      } : { background: 'rgba(148, 163, 184, 0.1)', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                      {d === 'shortlist' ? t('cand_shortlist') : d === 'hold' ? t('cand_hold') : t('cand_pass')}
                    </button>
                  ))}
                </div>
                <textarea
                  value={committeeNote}
                  onChange={e => setCommitteeNote(e.target.value)}
                  placeholder="Add committee notes..."
                  className="input-field text-xs bg-transparent"
                  rows={3}
                />
                {decision && (
                  <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                    ✓ {t('cand_decision_rec')} <strong className="capitalize">{t('cand_' + decision as any)}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Detail Panel */}
            <div className="lg:col-span-2 flex flex-col gap-4">

              {/* Radar Chart */}
              <div className="glass-card p-6 animate-fade-in-up delay-100">
                <h3 className="font-display font-bold text-slate-800 dark:text-white mb-4">{t('cand_radar')}</h3>
                <div className="h-56 relative w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                      <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                      <PolarAngleAxis dataKey="dim" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#3b5cff"
                        fill="#3b5cff"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{ background: '#0f1225', border: '1px solid rgba(59,92,255,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                        formatter={(val: number) => [`${val}/100`, 'Score']}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tabs */}
              <div className="glass-card-static overflow-hidden animate-fade-in-up delay-200">
                <div className="flex border-b border-slate-200 dark:border-white/5 overflow-x-auto">
                  {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-3 text-sm font-medium transition-all flex-1 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-brand-600 dark:text-brand-300 border-b-2 border-brand-500 bg-brand-50 dark:bg-brand-500/5'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
                      }`}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="animate-fade-in">
                      <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">{t('cand_score_breakdown')}</h4>
                      <ScoreBar score={sc.scores.leadership.score} label={t('metric_leadership')} explanation={sc.scores.leadership.explanation} />
                      <ScoreBar score={sc.scores.motivation.score} label={t('metric_motivation')} explanation={sc.scores.motivation.explanation} />
                      <ScoreBar score={sc.scores.growth.score} label={t('metric_growth')} explanation={sc.scores.growth.explanation} />
                      <ScoreBar score={sc.scores.communication.score} label={t('metric_communication')} explanation={sc.scores.communication.explanation} />
                      <ScoreBar score={sc.scores.growthVelocity.score} label={t('metric_velocity')} explanation={sc.scores.growthVelocity.explanation} />

                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-500 dark:text-slate-400">{t('cand_ai_suspicion')}</span>
                          <span className="font-mono font-bold text-sm" style={{ color: getScoreColor(100 - sc.scores.aiSuspicion.score) }}>
                            {sc.scores.aiSuspicion.score}/100
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${sc.scores.aiSuspicion.score}%`,
                              background: sc.scores.aiSuspicion.score >= 60
                                ? 'linear-gradient(90deg, #dc2626, #f87171)'
                                : sc.scores.aiSuspicion.score >= 30
                                  ? 'linear-gradient(90deg, #d97706, #fbbf24)'
                                  : 'linear-gradient(90deg, #059669, #34d399)',
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sc.scores.aiSuspicion.explanation}</p>
                      </div>
                    </div>
                  )}

                  {/* AI Heatmap Tab */}
                  {activeTab === 'ai_heatmap' && (
                    <div className="animate-fade-in">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white">{t('cand_ai_heatmap')}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded heat-1 inline-block" />Low</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded heat-2 inline-block" />Medium</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded heat-3 inline-block" />High</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        Sentences highlighted in 🟡 yellow/🔴 red show AI-generation signals (formulaic phrases, uniform sentence length, generic vocabulary).
                      </p>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-black/20 dark:border-white/5">
                        <EssayHeatmap essay={sc.candidate.essay} />
                      </div>
                      <div className="mt-4 flex items-center gap-2 p-3 rounded-lg"
                        style={{
                          background: sc.scores.aiSuspicion.score >= 60 ? 'rgba(220,38,38,0.1)' : 'rgba(5,150,105,0.1)',
                          border: `1px solid ${sc.scores.aiSuspicion.score >= 60 ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.3)'}`,
                        }}>
                        <span className="text-lg">{sc.scores.aiSuspicion.score >= 60 ? '⚠️' : '✅'}</span>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: sc.scores.aiSuspicion.score >= 60 ? '#f87171' : '#34d399' }}>
                            AI Suspicion Score: {sc.scores.aiSuspicion.score}/100
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{sc.scores.aiSuspicion.explanation}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Smart Questions Tab */}
                  {activeTab === 'questions' && (
                    <div className="animate-fade-in">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">{t('cand_smart_questions')}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        These questions target the candidate&apos;s lowest-scoring dimensions — helping the committee probe deeper where the application is weakest.
                      </p>
                      <div className="space-y-3">
                        {sc.smartQuestions.map((q, i) => (
                          <div key={i} className="p-4 rounded-xl animate-fade-in bg-brand-50 border border-brand-100 dark:bg-brand-950/20 dark:border-brand-900/30">
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-brand-200 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                                {i + 1}
                              </span>
                              <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{q}</p>
                            </div>
                          </div>
                        ))}
                        {sc.smartQuestions.length === 0 && (
                          <p className="text-slate-500 dark:text-slate-400 text-sm">All dimensions are strong — no targeted questions needed.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Evidence Tab */}
                  {activeTab === 'evidence' && (
                    <div className="animate-fade-in space-y-4">
                      {/* Experience */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Experience</h4>
                        <div className="space-y-1">
                          {sc.candidate.experience?.map((e, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <span className="text-brand-500 dark:text-brand-400 mt-0.5">→</span>
                              {e}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Achievements</h4>
                        <div className="space-y-1">
                          {sc.candidate.achievements?.map((a, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <span className="text-gold-500 dark:text-gold-400 mt-0.5">★</span>
                              {a}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Score Evidence */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">AI Scoring Evidence</h4>
                        <div className="space-y-2">
                          {Object.entries(sc.scores).map(([key, dim]) => (
                            <details key={key} className="group">
                              <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white flex items-center gap-2 transition-colors py-1">
                                <span className="text-brand-500 dark:text-brand-400">▸</span>
                                {t('metric_' + key as any) || dim.label} — <span style={{ color: getScoreColor(dim.score) }} className="font-mono">{dim.score}</span>
                              </summary>
                              <div className="ml-4 mt-1 space-y-1">
                                {dim.evidence?.map((e, i) => (
                                  <div key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1">
                                    <span className="text-slate-400 dark:text-slate-600">·</span> {e}
                                  </div>
                                ))}
                              </div>
                            </details>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
