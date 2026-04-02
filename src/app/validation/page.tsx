'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ScatterChart, Scatter, CartesianGrid, Legend,
} from 'recharts';

interface ValidationData {
  model_comparison: {
    spearman_correlation: number;
    interpretation: string;
    accept_reject_agreement: number;
    advanced_stats: Record<string, number>;
    baseline_stats: Record<string, number>;
  };
  dimension_statistics: Record<string, Record<string, number>>;
  recommendation_distribution: Record<string, number>;
  edge_cases: Array<{
    candidate_name: string;
    advanced_score: number;
    baseline_score: number;
    difference: number;
    direction: string;
    likely_reason: string;
  }>;
  total_candidates: number;
  shortlisted_count: number;
  ai_flagged_count: number;
}

const DIM_LABELS: Record<string, string> = {
  leadership: 'Leadership',
  motivation: 'Motivation',
  growth: 'Growth',
  communication: 'Communication',
  growthVelocity: 'Velocity',
};

const REC_COLORS: Record<string, string> = {
  STRONG_YES: '#34d399',
  YES: '#60a5fa',
  MAYBE: '#fbbf24',
  NO: '#f87171',
};

function MetricCard({ label, value, sub, color, hint }: {
  label: string; value: string | number; sub?: string; color?: string; hint?: string;
}) {
  return (
    <div className="glass-card p-5" title={hint}>
      <div className="text-3xl font-display font-bold mb-1" style={{ color: color || '#6088ff' }}>{value}</div>
      <div className="text-white font-semibold text-sm">{label}</div>
      {sub && <div className="text-slate-400 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

export default function ValidationPage() {
  const [data, setData] = useState<ValidationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');

  useEffect(() => {
    fetch('/api/validation')
      .then(r => r.json())
      .then(d => {
        setData(d.data);
        setSource(d.source || '');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Running model validation...</p>
        </div>
      </div>
    </>
  );

  if (!data) return null;

  const spearman = data.model_comparison.spearman_correlation;
  const spearmanColor = spearman >= 0.7 ? '#34d399' : spearman >= 0.4 ? '#fbbf24' : '#f87171';

  // Dimension chart data
  const dimChartData = Object.entries(data.dimension_statistics).map(([key, stats]) => ({
    name: DIM_LABELS[key] || key,
    mean: stats.mean,
    median: stats.median,
    std: stats.std,
  }));

  // Score distribution comparison
  const statsCompare = [
    { metric: 'Mean', advanced: data.model_comparison.advanced_stats.mean, baseline: data.model_comparison.baseline_stats.mean },
    { metric: 'Std Dev', advanced: data.model_comparison.advanced_stats.std, baseline: data.model_comparison.baseline_stats.std },
    { metric: 'Range', advanced: data.model_comparison.advanced_stats.range, baseline: data.model_comparison.baseline_stats.range },
  ];

  // Recommendation chart data
  const recData = Object.entries(data.recommendation_distribution).map(([k, v]) => ({
    name: k.replace('_', ' '),
    value: v,
    fill: REC_COLORS[k] || '#94a3b8',
  }));

  const radarData = Object.entries(data.dimension_statistics).map(([key, stats]) => ({
    dim: DIM_LABELS[key] || key,
    mean: stats.mean,
    max: stats.max,
    min: stats.min,
  }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-display font-bold text-white">
                Model <span className="gradient-text">Validation</span> Report
              </h1>
              <span className="px-2 py-1 rounded-lg text-xs font-mono"
                style={{ background: source === 'python_nlp' ? 'rgba(52,211,153,0.1)' : 'rgba(96,165,250,0.1)',
                         border: source === 'python_nlp' ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(96,165,250,0.3)',
                         color: source === 'python_nlp' ? '#34d399' : '#60a5fa' }}>
                {source === 'python_nlp' ? '🐍 Python NLP' : '⚡ TS Engine'}
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl">
              Statistical comparison of our <strong className="text-white">Advanced NLP Model</strong> vs a simple
              <strong className="text-white"> Rule-Based Baseline</strong>. This validates that our system provides
              meaningful signal beyond raw GPA/experience counts.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up delay-100">
            <MetricCard
              label="Spearman ρ"
              value={spearman.toFixed(3)}
              sub={data.model_comparison.interpretation}
              color={spearmanColor}
              hint="Rank correlation between Advanced and Baseline models. Higher = models agree on ordering."
            />
            <MetricCard
              label="Accept Agreement"
              value={`${Math.round(data.model_comparison.accept_reject_agreement * 100)}%`}
              sub="Baseline vs Advanced accept/reject"
              color="#a78bfa"
              hint="How often both models agree on accept vs reject decision at 50-point threshold"
            />
            <MetricCard
              label="Shortlisted"
              value={`${data.shortlisted_count}/${data.total_candidates}`}
              sub="Strong Yes + Yes verdicts"
              color="#34d399"
            />
            <MetricCard
              label="AI Flagged"
              value={data.ai_flagged_count}
              sub="Needs authenticity review"
              color="#f87171"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* Score Distribution Comparison */}
            <div className="glass-card-static p-5 animate-fade-in-up delay-200">
              <h3 className="font-display font-bold text-white mb-1">Score Distribution: Advanced vs Baseline</h3>
              <p className="text-slate-400 text-xs mb-4">
                Our model produces higher variance (more discrimination) and shifts scores based on NLP signals, not just counts.
              </p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsCompare}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#0f1225', border: '1px solid rgba(59,92,255,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                    <Bar dataKey="advanced" name="Advanced NLP" fill="#3b5cff" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="baseline" name="Baseline Rules" fill="#475569" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendation Distribution */}
            <div className="glass-card-static p-5 animate-fade-in-up delay-200">
              <h3 className="font-display font-bold text-white mb-1">Verdict Distribution</h3>
              <p className="text-slate-400 text-xs mb-4">
                How the advanced model classifies the 12 demo candidates across recommendation tiers.
              </p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={90} />
                    <Tooltip
                      contentStyle={{ background: '#0f1225', border: '1px solid rgba(59,92,255,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    />
                    <Bar dataKey="value" name="Candidates" radius={[0, 3, 3, 0]}>
                      {recData.map((entry, i) => (
                        <rect key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* Dimension Statistics */}
            <div className="glass-card-static p-5 animate-fade-in-up delay-300">
              <h3 className="font-display font-bold text-white mb-1">Per-Dimension Score Stats</h3>
              <p className="text-slate-400 text-xs mb-4">Mean ± Std across all 12 candidates for each scoring dimension.</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dimChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#0f1225', border: '1px solid rgba(59,92,255,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                    <Bar dataKey="mean" name="Mean" fill="#3b5cff" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="std" name="Std Dev" fill="#7c3aed" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Stats table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/5">
                      <th className="text-left pb-2 pr-3">Dimension</th>
                      <th className="text-right pb-2 pr-3">Mean</th>
                      <th className="text-right pb-2 pr-3">Median</th>
                      <th className="text-right pb-2">Std</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.dimension_statistics).map(([key, stats]) => (
                      <tr key={key} className="border-b border-white/3">
                        <td className="py-1.5 pr-3 text-slate-300">{DIM_LABELS[key] || key}</td>
                        <td className="py-1.5 pr-3 text-right font-mono text-white">{stats.mean}</td>
                        <td className="py-1.5 pr-3 text-right font-mono text-white">{stats.median}</td>
                        <td className="py-1.5 text-right font-mono text-slate-400">{stats.std}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Radar: Avg Profile */}
            <div className="glass-card-static p-5 animate-fade-in-up delay-300">
              <h3 className="font-display font-bold text-white mb-1">Average Candidate Profile</h3>
              <p className="text-slate-400 text-xs mb-3">Mean scores across all dimensions — shows which areas the cohort is strongest in.</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="dim" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Radar name="Mean" dataKey="mean" stroke="#3b5cff" fill="#3b5cff" fillOpacity={0.2} strokeWidth={2} />
                    <Radar name="Max" dataKey="max" stroke="#34d399" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                    <Tooltip contentStyle={{ background: '#0f1225', border: '1px solid rgba(59,92,255,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Edge Cases */}
          {data.edge_cases.length > 0 && (
            <div className="glass-card-static p-5 mb-6 animate-fade-in-up delay-400">
              <h3 className="font-display font-bold text-white mb-1">Edge Cases — Model Disagreements</h3>
              <p className="text-slate-400 text-xs mb-4">
                Candidates where Advanced NLP and Baseline models differ by ≥15 points.
                These cases validate that our model captures signal invisible to simple rules.
              </p>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Advanced Score</th>
                      <th>Baseline Score</th>
                      <th>Difference</th>
                      <th>Direction</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.edge_cases.map((ec, i) => (
                      <tr key={i}>
                        <td className="font-semibold text-white">{ec.candidate_name}</td>
                        <td>
                          <span className="font-mono font-bold text-brand-400">{ec.advanced_score}</span>
                        </td>
                        <td>
                          <span className="font-mono text-slate-400">{ec.baseline_score}</span>
                        </td>
                        <td>
                          <span className="font-mono font-bold" style={{
                            color: ec.difference >= 25 ? '#f87171' : '#fbbf24'
                          }}>
                            Δ{ec.difference}
                          </span>
                        </td>
                        <td>
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: ec.direction === 'advanced_higher' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                              color: ec.direction === 'advanced_higher' ? '#34d399' : '#f87171',
                              border: ec.direction === 'advanced_higher' ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(248,113,113,0.3)',
                            }}>
                            {ec.direction === 'advanced_higher' ? 'NLP ↑' : 'Baseline ↑'}
                          </span>
                        </td>
                        <td className="text-xs text-slate-400 max-w-xs">{ec.likely_reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Methodology */}
          <div className="glass-card-static p-6 animate-fade-in-up delay-500">
            <h3 className="font-display font-bold text-white mb-4">Scoring Methodology</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-brand-300 mb-2">Advanced NLP Model (Our System)</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">→</span>Flesch reading ease & vocabulary richness (RTTR)</li>
                  <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">→</span>Bilingual keyword density (EN + RU leadership/motivation/growth)</li>
                  <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">→</span>Sentence burstiness (AI detection via variance analysis)</li>
                  <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">→</span>Essay specificity (numbers, scale, results detection)</li>
                  <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">→</span>Age-adjusted growth velocity score</li>
                  <li className="flex items-start gap-2"><span className="text-brand-400 mt-0.5">→</span>Multi-signal AI phrase detection (20+ clichés)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Baseline (Simple Rules)</h4>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li className="flex items-start gap-2"><span className="text-slate-600 mt-0.5">→</span>GPA / 5.0 × 100</li>
                  <li className="flex items-start gap-2"><span className="text-slate-600 mt-0.5">→</span>Experience count × 12</li>
                  <li className="flex items-start gap-2"><span className="text-slate-600 mt-0.5">→</span>Achievement count × 18</li>
                  <li className="flex items-start gap-2"><span className="text-slate-600 mt-0.5">→</span>Essay word count ÷ 3</li>
                  <li className="flex items-start gap-2"><span className="text-slate-600 mt-0.5">→</span><em>No NLP, no semantic analysis</em></li>
                </ul>

                <div className="mt-4 p-3 rounded-lg text-xs"
                  style={{ background: 'rgba(59,92,255,0.08)', border: '1px solid rgba(59,92,255,0.2)' }}>
                  <div className="text-brand-300 font-semibold mb-1">Improvement over baseline:</div>
                  <div className="text-slate-400">
                    Our model catches candidates with strong potential but modest credentials (e.g. Малика Нурлан),
                    and penalizes hollow essays regardless of GPA.
                    Spearman ρ = <strong className="text-white">{spearman.toFixed(3)}</strong> — models partially agree
                    but diverge meaningfully on borderline cases.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
