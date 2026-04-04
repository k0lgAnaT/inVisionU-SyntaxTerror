'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ScoredCandidate } from '@/types';
import { getScoreColor, getRecommendationLabel, getRecommendationBadgeClass } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';

function StatCard({ value, label, sub, color }: { value: string | number; label: string; sub?: string; color?: string }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-1">
      <div className="text-3xl font-display font-bold" style={{ color: color || 'var(--tw-colors-brand-600)' }}>{value}</div>
      <div className="text-slate-800 dark:text-white font-semibold text-sm">{label}</div>
      {sub && <div className="text-slate-500 dark:text-slate-400 text-xs">{sub}</div>}
    </div>
  );
}

function ScoreRing({ score, size = 80, children }: { score: number; size?: number; children?: React.ReactNode }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} className="absolute">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${progress} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
        />
      </svg>
      <div className="z-10">
        {children}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [candidates, setCandidates] = useState<ScoredCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [blindMode, setBlindMode] = useState(false);
  const { t, lang } = useLanguage();

  useEffect(() => {
    // 🛡️ AUTH GUARD
    const role = localStorage.getItem('userRole');
    if (!role || role === 'student') {
      window.location.href = '/login';
      return;
    }

    fetch('/api/candidates')
      .then(r => r.json())
      .then(d => {
        const apiData = d.data || [];
        const localData = JSON.parse(localStorage.getItem('demo_submissions') || '[]');
        setCandidates([...localData, ...apiData]);
        setLoading(false);
      });
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
        <div className="relative overflow-hidden bg-brand-50 dark:bg-[#0b0e1e] border-b border-brand-100 dark:border-brand-900/30">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full opacity-10 animate-pulse-slow"
              style={{ background: 'radial-gradient(circle, #3b5cff 0%, transparent 70%)' }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 relative">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800/50">
                    Decentrathon 5.0 · {t('dash_track')}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-800 dark:text-white mb-3 leading-tight">
                  <span className="gradient-text">inVision U</span> Intelligence v2.0
                  <br />{t('nav_dashboard')}
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-base max-w-lg leading-relaxed">
                  {t('lead_desc')}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
                  <Link href="/leaderboard" className="btn-primary w-full sm:w-auto text-center">
                    {t('nav_leaderboard')} →
                  </Link>
                    <Link href="/submit" className="btn-secondary w-full sm:w-auto text-center">
                      {t('nav_submit')}
                    </Link>
                    <Link href="/admin/users" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border border-emerald-500/30 flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-emerald-500/20">
                      👥 {t('prof_add_commission')}
                    </Link>
                  </div>
                </div>

              {!loading && (
                <div className="w-full lg:w-auto flex flex-wrap justify-center lg:justify-start gap-4 animate-fade-in-up delay-200">
                  {top3.map((sc, i) => (
                    <Link key={sc.candidate.id} href={`/candidates/${sc.candidate.id}`}>
                      <div
                        className="glass-card p-4 w-full sm:w-40 flex flex-col items-center text-center cursor-pointer hover:-translate-y-1 transition-transform relative"
                        style={i === 0 ? { borderColor: 'rgba(251,191,36,0.4)', boxShadow: '0 0 20px rgba(251,191,36,0.15)' } : {}}
                      >
                        {i === 0 && <div className="text-lg mb-1">🏆</div>}
                        {i === 1 && <div className="text-base mb-1">🥈</div>}
                        {i === 2 && <div className="text-base mb-1">🥉</div>}
                        <div className="mb-4">
                          <ScoreRing score={sc.totalScore} size={68}>
                            <span className="text-xl font-bold font-mono tracking-tighter" style={{ color: getScoreColor(sc.totalScore) }}>
                              {sc.totalScore}
                            </span>
                          </ScoreRing>
                        </div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-white truncate w-full">
                          {blindMode ? `${t('lead_candidate')} #${sc.rank}` : sc.candidate.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sc.candidate.city}</div>
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
                <p className="text-slate-600 dark:text-slate-400 text-sm">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up delay-100">
                <StatCard value={candidates.length} label={t('lead_candidates')} sub={t('dash_stat_total')} color="#6088ff" />
                <StatCard value={shortlisted.length} label={t('cand_shortlist')} sub={t('dash_stat_short')} color="#34d399" />
                <StatCard value={`${avgScore}`} label={t('cand_total_score')} sub={t('dash_stat_avg')} color="#fbbf24" />
                <StatCard value={flagged.length} label={t('cand_ai_suspicion')} sub={t('dash_stat_flag')} color="#f87171" />
              </div>

              {/* Blind Mode Banner */}
              {blindMode && (
                <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in bg-purple-50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-800/30 border">
                  <span className="text-2xl">🎭</span>
                  <div>
                    <div className="text-purple-700 dark:text-purple-400 font-semibold text-sm">{t('lead_blind_mode')} {t('dash_blind_active')}</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs text-balance">{t('dash_blind_desc')}</div>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="glass-card-static overflow-hidden mb-8 animate-fade-in-up delay-200">
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-transparent">
                  <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg">{t('lead_title')}</h2>
                  <Link href="/leaderboard" className="text-brand-500 dark:text-brand-400 text-sm hover:text-brand-600 dark:hover:text-brand-300 transition-colors">
                    {t('nav_leaderboard')} →
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t('lead_candidate')}</th>
                        <th>{t('cand_total_score')}</th>
                        <th>{t('metric_leadership')}</th>
                        <th>{t('metric_motivation')}</th>
                        <th>{t('metric_velocity')}</th>
                        <th>{t('lead_ai_risk')}</th>
                        <th>{t('cand_ai_rec')}</th>
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
                              <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">#{sc.rank}</span>
                            </td>
                            <td>
                              <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                {blindMode ? `${t('lead_candidate')} #${sc.rank}` : sc.candidate.name}
                              </div>
                              {!blindMode && (
                                <div className="text-xs text-slate-600 dark:text-slate-400">{sc.candidate.city}</div>
                              )}
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold font-mono" style={{ color: getScoreColor(sc.totalScore) }}>
                                  {sc.totalScore}
                                </span>
                              </div>
                            </td>
                            <td><span className="font-mono text-sm">{sc.scores.leadership.score}</span></td>
                            <td><span className="font-mono text-sm">{sc.scores.motivation.score}</span></td>
                            <td><span className="font-mono text-sm">{sc.scores.growthVelocity.score}</span></td>
                            <td>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" 
                                    style={{ color: aiLabel.c, background: `${aiLabel.c}15`, border: `1px solid ${aiLabel.c}30` }}>
                                {aiLabel.l === 'High' ? t('dash_ai_high') : aiLabel.l === 'Mid' ? t('dash_ai_mid') : t('dash_ai_clean')}
                              </span>
                            </td>
                            <td>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRecommendationBadgeClass(sc.shortlistRecommendation)}`}>
                                {getRecommendationLabel(sc.shortlistRecommendation, t)}
                              </span>
                            </td>
                            <td>
                              <Link href={`/candidates/${sc.candidate.id}`} className="text-brand-600 hover:underline text-xs font-bold">
                                {t('lead_deep_dive')}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
