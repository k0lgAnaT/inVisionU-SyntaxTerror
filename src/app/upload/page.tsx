'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ScoredCandidate } from '@/types';
import { getScoreColor, getRecommendationLabel, getRecommendationBadgeClass } from '@/lib/utils';
import Link from 'next/link';

const SAMPLE_JSON = JSON.stringify([
  {
    "id": "sample-1",
    "name": "Arlан Белеков",
    "age": 18,
    "city": "Астана",
    "school": "НИШ Астана",
    "gpa": 4.7,
    "submittedAt": "2024-12-01",
    "essay": "Я создал экологическое движение в своём городе когда учился в 10 классе. Начинал один, сейчас нас 50 человек. Мы посадили 2000 деревьев и убрали 40 тонн мусора. Хочу в inVision U чтобы научиться масштабировать это на всю страну и привлечь корпоративных партнёров.",
    "experience": ["Founder EcoAstana movement", "Volunteer coordinator (50 people)", "Speaker at Climate Youth Summit"],
    "achievements": ["Best Youth Initiative award", "Ministry of Ecology recognition"],
    "languages": ["Kazakh", "Russian", "English"],
    "socialLinks": {},
    "videoStatement": true,
    "references": 2,
    "extracurricular": "Экология, бег, фотография"
  }
], null, 2);

export default function UploadPage() {
  const [jsonText, setJsonText] = useState('');
  const [results, setResults] = useState<ScoredCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState('default');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonText(text);
      setError('');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleScore = async () => {
    try {
      const parsed = JSON.parse(jsonText);
      const candidates = Array.isArray(parsed) ? parsed : [parsed];
      setLoading(true);
      setError('');
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidates, profile }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Scoring failed');
      }
    } catch {
      setError('Invalid JSON format. Please check your file.');
    }
    setLoading(false);
  };

  const downloadResults = () => {
    const csv = [
      ['Rank', 'Name', 'Total Score', 'Leadership', 'Motivation', 'Growth', 'Velocity', 'AI Risk', 'Verdict'].join(','),
      ...results.map(r => [
        r.rank,
        `"${r.candidate.name}"`,
        r.totalScore,
        r.scores.leadership.score,
        r.scores.motivation.score,
        r.scores.growth.score,
        r.scores.growthVelocity.score,
        r.scores.aiSuspicion.score,
        r.shortlistRecommendation,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invision-u-scoring-results.csv';
    a.click();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-display font-bold text-white mb-1">
              Batch <span className="gradient-text">Upload & Score</span>
            </h1>
            <p className="text-slate-400 text-sm">Upload a JSON file of candidates and score the entire pool at once.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Upload Area */}
            <div className="space-y-4 animate-fade-in-up delay-100">

              {/* Drag & Drop */}
              <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className="rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer"
                style={{
                  borderColor: dragOver ? '#3b5cff' : 'rgba(59,92,255,0.25)',
                  background: dragOver ? 'rgba(59,92,255,0.08)' : 'rgba(22,25,48,0.5)',
                }}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <div className="text-4xl mb-3">{dragOver ? '📂' : '📁'}</div>
                <div className="text-white font-semibold mb-1">Drop JSON file here</div>
                <div className="text-slate-400 text-sm">or click to browse</div>
                <input
                  id="fileInput"
                  type="file"
                  accept=".json,.csv"
                  className="hidden"
                  onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                />
              </div>

              {/* Profile Selector */}
              <div className="glass-card-static p-4">
                <label className="text-xs text-slate-400 font-medium mb-2 block">Scoring Profile</label>
                <select value={profile} onChange={e => setProfile(e.target.value)} className="input-field">
                  <option value="default">Balanced (Default)</option>
                  <option value="leadership">Leadership Focus</option>
                  <option value="authenticity">Authenticity Focus</option>
                  <option value="potential">Growth Potential</option>
                </select>
              </div>

              {/* JSON Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-white">JSON Data</label>
                  <button onClick={() => setJsonText(SAMPLE_JSON)} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    Load Sample →
                  </button>
                </div>
                <textarea
                  className="input-field font-mono text-xs"
                  rows={12}
                  value={jsonText}
                  onChange={e => setJsonText(e.target.value)}
                  placeholder={`Paste JSON array of candidates here, or upload a file above.\n\nExample format:\n[\n  {\n    "name": "Candidate Name",\n    "age": 18,\n    "city": "Almaty",\n    "essay": "Your essay text..."\n  }\n]`}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg text-sm text-red-400"
                  style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
                  ⚠️ {error}
                </div>
              )}

              <button onClick={handleScore} disabled={loading || !jsonText.trim()}
                className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scoring batch...
                  </span>
                ) : `⚡ Score ${jsonText ? 'Batch' : 'Candidates'}`}
              </button>
            </div>

            {/* Results */}
            <div className="animate-fade-in-up delay-200">
              {!results.length && !loading && (
                <div className="glass-card p-10 text-center h-full flex flex-col items-center justify-center">
                  <div className="text-5xl mb-4 opacity-20">📊</div>
                  <p className="text-slate-400 text-sm">Batch results will appear here after scoring.</p>
                  <button onClick={() => setJsonText(SAMPLE_JSON)}
                    className="mt-4 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    Load sample data →
                  </button>
                </div>
              )}

              {loading && (
                <div className="glass-card p-10 text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin mx-auto mb-4" />
                  <p className="text-slate-400">Scoring candidates...</p>
                </div>
              )}

              {results.length > 0 && !loading && (
                <div className="space-y-3">
                  {/* Summary */}
                  <div className="glass-card-static p-4 flex items-center justify-between">
                    <div>
                      <span className="text-white font-semibold">{results.length} candidates</span>
                      <span className="text-slate-400 text-sm ml-2">scored</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-slate-400">
                        Avg: <span className="text-white font-mono font-bold">
                          {Math.round(results.reduce((a, r) => a + r.totalScore, 0) / results.length)}
                        </span>
                      </div>
                      <button onClick={downloadResults} className="btn-secondary text-xs py-1.5">
                        ↓ CSV
                      </button>
                    </div>
                  </div>

                  {/* Results list */}
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {results.map((r, i) => (
                      <div key={i} className="glass-card p-4 flex items-center gap-4 animate-fade-in"
                        style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className="text-slate-400 font-mono text-sm w-8 flex-shrink-0">#{r.rank}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm truncate">{r.candidate.name}</div>
                          <div className="text-xs text-slate-400">{r.candidate.city}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-lg font-bold font-mono" style={{ color: getScoreColor(r.totalScore) }}>
                              {r.totalScore}
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${getRecommendationBadgeClass(r.shortlistRecommendation)}`}>
                            {getRecommendationLabel(r.shortlistRecommendation)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
