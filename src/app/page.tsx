'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ScoredCandidate } from '@/types';
import { getScoreColor, getRecommendationLabel, getRecommendationBadgeClass } from '@/lib/utils';

function StatCard({ value, label, sub, color }: { value: string | number; label: string; sub?: string; color?: string }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-1">
      <div className="text-3xl font-display font-bold" style={{ color: color || 'var(--tw-colors-brand-600)' }}>{value}</div>
      <div className="text-slate-800 font-semibold text-sm">{label}</div>
      {sub && <div className="text-slate-500 text-xs">{sub}</div>}
    </div>
  );
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${progress} ${circ}`}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: 'stroke-dasharray 1s ease' }}
      />
    </svg>
  );
}

export default function DashboardPage() {
  const [candidates, setCandidates] = useState<ScoredCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [blindMode, setBlindMode] = useState(false);

  useEffect(() => {
    fetch('/api/candidates')
      .then(r => r.json())
      .then(d => { setCandidates(d.data || []); setLoading(false); });
  }, []);

  const shortlisted = candidates.filter(c => c.shortlistRecommendation === 'STRONG_YES' || c.shortlistRecommendation === 'YES');
  const flagged = candidates.filter(c => c.flags.some(f => f.includes('AI')));
  const avgScore = candidates.length ? Math.round(candidates.reduce((a, c) => a + c.totalScore, 0) / candidates.length) : 0;
  const top3 = candidates.slice(0, 3);

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-16">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-brand-50 border-b border-brand-100">
          {/* Animated orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full opacity-10 animate-pulse-slow"
              style={{ background: 'radial-gradient(circle, #3b5cff 0%, transparent 70%)' }} />
            <div className="absolute top-5 right-1/4 w-56 h-56 rounded-full opacity-8"
              style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', animationDelay: '2s' }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 relative">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 border border-brand-200">
                    Decentrathon 5.0 · AI inDrive Track
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-800 mb-3 leading-tight">
                  Candidate <span className="gradient-text">Intelligence</span>
                  <br />Platform
                </h1>
                <p className="text-slate-600 text-base max-w-lg leading-relaxed">
                  AI-powered, explainable scoring for the inVision U admissions committee.
                  Every score comes with reasoning. Every decision stays human.
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <Link href="/leaderboard" className="btn-primary">
                    View Leaderboard →
                  </Link>
                  <Link href="/submit" className="btn-secondary">
                    Test Submission
                  </Link>
                </div>
              </div>

              {/* Top 3 mini cards */}
              {!loading && (
                <div className="flex gap-3 animate-fade-in-up delay-200">
                  {top3.map((sc, i) => (
                    <Link key={sc.candidate.id} href={`/candidates/${sc.candidate.id}`}>
                      <div
                        className="glass-card p-4 w-40 flex flex-col items-center text-center cursor-pointer"
                        style={i === 0 ? { borderColor: 'rgba(251,191,36,0.4)', boxShadow: '0 0 20px rgba(251,191,36,0.15)' } : {}}
                      >
                        {i === 0 && <div className="text-lg mb-1">🏆</div>}
                        {i === 1 && <div className="text-base mb-1">🥈</div>}
                        {i === 2 && <div className="text-base mb-1">🥉</div>}
                        <div className="mb-2">
                          <ScoreRing score={sc.totalScore} size={64} />
                        </div>
                        <div className="relative">
                          <div className="-mt-10 mb-2 text-lg font-bold" style={{ color: getScoreColor(sc.totalScore) }}>
                            {sc.totalScore}
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-slate-800 truncate w-full">
                          {blindMode ? `Candidate #${sc.rank}` : sc.candidate.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{sc.candidate.city}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-brand-400 border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-slate-600 text-sm">Scoring candidates...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up delay-100">
                <StatCard value={candidates.length} label="Total Applicants" sub="This cycle" color="#6088ff" />
                <StatCard value={shortlisted.length} label="Shortlisted" sub="Strong Yes + Yes" color="#34d399" />
                <StatCard value={`${avgScore}`} label="Average Score" sub="Pool median" color="#fbbf24" />
                <StatCard value={flagged.length} label="AI Flagged" sub="Needs review" color="#f87171" />
              </div>

              {/* Blind Mode Banner */}
              {blindMode && (
                <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in"
                  style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)' }}>
                  <span className="text-2xl">🎭</span>
                  <div>
                    <div className="text-purple-600 font-semibold text-sm">Blind Review Mode Active</div>
                    <div className="text-slate-600 text-xs">Candidate names are hidden. Evaluate on merit alone.</div>
                  </div>
                </div>
              )}

              {/* Candidate Table */}
              <div className="glass-card-static overflow-hidden mb-8 animate-fade-in-up delay-200">
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white">
                  <h2 className="font-display font-bold text-slate-800 text-lg">Комиссия - Общий рейтинг</h2>
                  <Link href="/leaderboard" className="text-brand-400 text-sm hover:text-brand-300 transition-colors">
                    Full leaderboard →
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Candidate</th>
                        <th>Score</th>
                        <th>Leadership</th>
                        <th>Motivation</th>
                        <th>Growth Velocity</th>
                        <th>AI Risk</th>
                        <th>AI Пред-скор</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((sc) => {
                        const aiLabel = sc.scores.aiSuspicion.score >= 60 ? { l: 'High', c: '#f87171' }
                          : sc.scores.aiSuspicion.score >= 30 ? { l: 'Mid', c: '#fbbf24' }
                          : { l: 'Clean', c: '#34d399' };
                        return (
                          <tr key={sc.candidate.id}>
                            <td>
                              <span className="text-slate-400 font-mono text-xs">#{sc.rank}</span>
                            </td>
                            <td>
                              <div className="font-semibold text-slate-800 text-sm">
                                {blindMode ? `Candidate #${sc.rank}` : sc.candidate.name}
                              </div>
                              {!blindMode && (
                                <div className="text-xs text-slate-600">{sc.candidate.city} · {sc.candidate.age}y</div>
                              )}
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold font-mono" style={{ color: getScoreColor(sc.totalScore) }}>
                                  {sc.totalScore}
                                </span>
                                <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                  <div className="h-full rounded-full transition-all"
                                    style={{ width: `${sc.totalScore}%`, background: getScoreColor(sc.totalScore) }} />
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ color: getScoreColor(sc.scores.leadership.score) }} className="font-mono font-semibold text-sm">
                                {sc.scores.leadership.score}
                              </span>
                            </td>
                            <td>
                              <span style={{ color: getScoreColor(sc.scores.motivation.score) }} className="font-mono font-semibold text-sm">
                                {sc.scores.motivation.score}
                              </span>
                            </td>
                            <td>
                              <span style={{ color: getScoreColor(sc.scores.growthVelocity.score) }} className="font-mono font-semibold text-sm">
                                {sc.scores.growthVelocity.score}
                              </span>
                            </td>
                            <td>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                style={{ color: aiLabel.c, background: `${aiLabel.c}18`, border: `1px solid ${aiLabel.c}40` }}>
                                {aiLabel.l}
                              </span>
                            </td>
                            <td>
                              <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${getRecommendationBadgeClass(sc.shortlistRecommendation)}`}>
                                {getRecommendationLabel(sc.shortlistRecommendation)}
                              </span>
                            </td>
                            <td>
                              <Link href={`/candidates/${sc.candidate.id}`}
                                className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors">
                                View →
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-300">
                <Link href="/leaderboard">
                  <div className="glass-card p-5 h-full bg-white">
                    <div className="text-2xl mb-3">⬡</div>
                    <h3 className="font-display font-bold text-slate-800 mb-1">Full Leaderboard</h3>
                    <p className="text-slate-600 text-sm">Sort, filter and compare all candidates with detailed dimension scores.</p>
                  </div>
                </Link>
                <Link href="/upload">
                  <div className="glass-card p-5 h-full bg-white">
                    <div className="text-2xl mb-3">↑</div>
                    <h3 className="font-display font-bold text-slate-800 mb-1">Batch Upload</h3>
                    <p className="text-slate-600 text-sm">Score an entire applicant pool by uploading a JSON or CSV file.</p>
                  </div>
                </Link>
                <Link href="/submit">
                  <div className="glass-card p-5 h-full bg-white">
                    <div className="text-2xl mb-3">✦</div>
                    <h3 className="font-display font-bold text-slate-800 mb-1">Live Scoring Preview</h3>
                    <p className="text-slate-600 text-sm">See your score update in real-time as you fill in the application form.</p>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
