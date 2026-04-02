'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ScoredCandidate, WeightProfile } from '@/types';
import { getScoreColor, getRecommendationLabel, getRecommendationBadgeClass } from '@/lib/utils';

const WEIGHT_PROFILES: { value: WeightProfile; label: string; desc: string }[] = [
  { value: 'default', label: 'Balanced', desc: 'Equal weight across all dimensions' },
  { value: 'leadership', label: 'Leadership Focus', desc: 'Prioritize leadership signals' },
  { value: 'authenticity', label: 'Authenticity Focus', desc: 'Prioritize genuine motivation' },
  { value: 'potential', label: 'Growth Potential', desc: 'Prioritize velocity & trajectory' },
];

type SortKey = 'totalScore' | 'leadership' | 'motivation' | 'growth' | 'communication' | 'growthVelocity' | 'aiSuspicion';

export default function LeaderboardPage() {
  const [candidates, setCandidates] = useState<ScoredCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [blindMode, setBlindMode] = useState(false);
  const [profile, setProfile] = useState<WeightProfile>('default');
  const [sortKey, setSortKey] = useState<SortKey>('totalScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterRec, setFilterRec] = useState<string>('all');
  const [filterFlag, setFilterFlag] = useState<string>('all');
  const [search, setSearch] = useState('');

  const loadCandidates = (p: WeightProfile) => {
    setLoading(true);
    fetch(`/api/candidates?profile=${p}`)
      .then(r => r.json())
      .then(d => { setCandidates(d.data || []); setLoading(false); });
  };

  useEffect(() => { loadCandidates(profile); }, [profile]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const getScore = (sc: ScoredCandidate, key: SortKey): number => {
    if (key === 'totalScore') return sc.totalScore;
    return sc.scores[key as keyof typeof sc.scores]?.score ?? 0;
  };

  const filtered = candidates
    .filter(sc => {
      if (filterRec !== 'all' && sc.shortlistRecommendation !== filterRec) return false;
      if (filterFlag === 'ai_flagged' && !sc.flags.some(f => f.includes('AI'))) return false;
      if (filterFlag === 'high_velocity' && !sc.flags.some(f => f.includes('velocity'))) return false;
      if (filterFlag === 'leader' && !sc.flags.some(f => f.includes('leader'))) return false;
      if (search && !sc.candidate.name.toLowerCase().includes(search.toLowerCase()) &&
          !sc.candidate.city.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const diff = getScore(a, sortKey) - getScore(b, sortKey);
      return sortDir === 'desc' ? -diff : diff;
    });

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => handleSort(k)} className={`flex items-center gap-1 hover:text-white transition-colors ${sortKey === k ? 'text-brand-400' : 'text-slate-400'}`}>
      {label}
      <span className="text-xs">{sortKey === k ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}</span>
    </button>
  );

  return (
    <>
      <Navbar blindMode={blindMode} onBlindToggle={() => setBlindMode(!blindMode)} />

      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-display font-bold text-white mb-1">
              Candidate <span className="gradient-text">Leaderboard</span>
            </h1>
            <p className="text-slate-400 text-sm">Ranked, filterable view of all applicants. Every score is explainable.</p>
          </div>

          {/* Controls Bar */}
          <div className="glass-card-static p-4 mb-6 animate-fade-in-up delay-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Weight Profile */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-medium">Scoring Profile</label>
                <div className="flex gap-2 flex-wrap">
                  {WEIGHT_PROFILES.map(p => (
                    <button key={p.value} onClick={() => setProfile(p.value)}
                      title={p.desc}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        profile === p.value
                          ? 'bg-brand-500/25 text-brand-300 border border-brand-500/40'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white'
                      }`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 flex-wrap lg:ml-auto items-end">
                {/* Recommendation Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-medium">Verdict</label>
                  <select value={filterRec} onChange={e => setFilterRec(e.target.value)}
                    className="input-field w-auto text-xs py-1.5">
                    <option value="all">All</option>
                    <option value="STRONG_YES">Strong Yes</option>
                    <option value="YES">Yes</option>
                    <option value="MAYBE">Maybe</option>
                    <option value="NO">No</option>
                  </select>
                </div>

                {/* Flag Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-medium">Flag</label>
                  <select value={filterFlag} onChange={e => setFilterFlag(e.target.value)}
                    className="input-field w-auto text-xs py-1.5">
                    <option value="all">All</option>
                    <option value="ai_flagged">AI Flagged</option>
                    <option value="leader">Strong Leaders</option>
                    <option value="high_velocity">High Velocity</option>
                  </select>
                </div>

                {/* Search */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-medium">Search</label>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={blindMode ? 'Search by city...' : 'Name or city...'}
                    className="input-field text-xs py-1.5 w-44"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-slate-400">Showing</span>
            <span className="text-white font-semibold">{filtered.length}</span>
            <span className="text-slate-400">of {candidates.length} candidates</span>
            {blindMode && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs"
                style={{ background: 'rgba(124,58,237,0.15)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.3)' }}>
                🎭 Blind Mode
              </span>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-24 text-slate-400">
              <div className="w-10 h-10 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin mx-auto mb-3" />
              Scoring all candidates...
            </div>
          ) : (
            <div className="glass-card-static overflow-hidden animate-fade-in-up delay-200">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Candidate</th>
                      <th><SortBtn k="totalScore" label="Total" /></th>
                      <th><SortBtn k="leadership" label="Lead." /></th>
                      <th><SortBtn k="motivation" label="Motiv." /></th>
                      <th><SortBtn k="growth" label="Growth" /></th>
                      <th><SortBtn k="growthVelocity" label="Velocity" /></th>
                      <th><SortBtn k="aiSuspicion" label="AI Risk" /></th>
                      <th>Flags</th>
                      <th>Verdict</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((sc, idx) => (
                      <tr key={sc.candidate.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.04}s` }}>
                        <td>
                          <div className="flex items-center gap-1">
                            {sc.rank === 1 && <span>🏆</span>}
                            {sc.rank === 2 && <span>🥈</span>}
                            {sc.rank === 3 && <span>🥉</span>}
                            <span className="text-slate-400 font-mono text-xs">#{sc.rank}</span>
                          </div>
                        </td>
                        <td>
                          <div className="font-semibold text-white">
                            {blindMode ? `Candidate #${sc.rank}` : sc.candidate.name}
                          </div>
                          {!blindMode && (
                            <div className="text-xs text-slate-400">{sc.candidate.city} · {sc.candidate.school?.split(' ').slice(0, 3).join(' ')}</div>
                          )}
                          <div className="text-xs text-slate-500">{sc.candidate.age}y · GPA {sc.candidate.gpa}</div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold font-mono" style={{ color: getScoreColor(sc.totalScore) }}>
                              {sc.totalScore}
                            </span>
                            <div className="w-12 h-1.5 rounded-full bg-white/10">
                              <div className="h-full rounded-full" style={{ width: `${sc.totalScore}%`, background: getScoreColor(sc.totalScore) }} />
                            </div>
                          </div>
                        </td>
                        {(['leadership','motivation','growth','growthVelocity'] as const).map(dim => (
                          <td key={dim}>
                            <span className="font-mono font-semibold text-sm" style={{ color: getScoreColor(sc.scores[dim].score) }}>
                              {sc.scores[dim].score}
                            </span>
                          </td>
                        ))}
                        <td>
                          {(() => {
                            const s = sc.scores.aiSuspicion.score;
                            const c = s >= 60 ? '#f87171' : s >= 30 ? '#fbbf24' : '#34d399';
                            const l = s >= 60 ? 'High' : s >= 30 ? 'Mid' : 'Clean';
                            return (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                style={{ color: c, background: `${c}18`, border: `1px solid ${c}40` }}>
                                {l} ({s})
                              </span>
                            );
                          })()}
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1 max-w-32">
                            {sc.flags.slice(0, 2).map((f, i) => (
                              <span key={i} className="text-xs" title={f}>{f.split(' ')[0]}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${getRecommendationBadgeClass(sc.shortlistRecommendation)}`}>
                            {getRecommendationLabel(sc.shortlistRecommendation)}
                          </span>
                        </td>
                        <td>
                          <Link href={`/candidates/${sc.candidate.id}`}
                            className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors whitespace-nowrap">
                            Deep Dive →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  No candidates match your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
