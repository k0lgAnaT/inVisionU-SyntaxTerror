import { NextRequest, NextResponse } from 'next/server';
import { scoreAllCandidates } from '@/lib/scoring/engine';
import { Candidate } from '@/types';
import candidatesData from '@/data/candidates.json';

// Try Python backend first, fall back to TS engine
const PYTHON_BACKEND = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';

interface ValidationReport {
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

function buildValidationFromTS(): ValidationReport {
  const candidates = candidatesData as Candidate[];
  const scored = scoreAllCandidates(candidates);

  // Baseline: simple GPA + experience + achievement + essay length
  const baselineScores = candidates.map(c => {
    const gpaScore = (c.gpa / 5.0) * 100;
    const expScore = Math.min(100, c.experience.length * 12);
    const achScore = Math.min(100, c.achievements.length * 18);
    const essayScore = Math.min(100, Math.floor(c.essay.split(' ').length / 3));
    return Math.round((gpaScore + expScore + achScore + essayScore) / 4);
  });

  const advancedScores = scored.map(s => s.totalScore);

  // Spearman rank correlation
  const n = advancedScores.length;
  const getRanks = (arr: number[]) => {
    const indexed = arr.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
    const ranks = new Array(n).fill(0);
    indexed.forEach((item, rank) => { ranks[item.i] = rank + 1; });
    return ranks;
  };
  const advRanks = getRanks(advancedScores);
  const baseRanks = getRanks(baselineScores);
  const dSqSum = advRanks.reduce((acc, r, i) => acc + Math.pow(r - baseRanks[i], 2), 0);
  const rho = Math.round((1 - (6 * dSqSum) / (n * (n * n - 1))) * 10000) / 10000;

  const advMean = Math.round(advancedScores.reduce((a, b) => a + b, 0) / n);
  const baseMean = Math.round(baselineScores.reduce((a, b) => a + b, 0) / n);
  const advMax = Math.max(...advancedScores);
  const advMin = Math.min(...advancedScores);
  const baseMax = Math.max(...baselineScores);
  const baseMin = Math.min(...baselineScores);
  const advStd = Math.round(Math.sqrt(advancedScores.reduce((acc, s) => acc + Math.pow(s - advMean, 2), 0) / n));
  const baseStd = Math.round(Math.sqrt(baselineScores.reduce((acc, s) => acc + Math.pow(s - baseMean, 2), 0) / n));

  const recDist: Record<string, number> = {};
  scored.forEach(s => {
    recDist[s.shortlistRecommendation] = (recDist[s.shortlistRecommendation] || 0) + 1;
  });

  // Edge cases: where models disagree most
  const edgeCases = candidates.map((c, i) => ({
    candidate_name: c.name,
    advanced_score: advancedScores[i],
    baseline_score: baselineScores[i],
    difference: Math.abs(advancedScores[i] - baselineScores[i]),
    direction: advancedScores[i] > baselineScores[i] ? 'advanced_higher' : 'baseline_higher',
    likely_reason: advancedScores[i] > baselineScores[i]
      ? 'Strong NLP signals (leadership/growth language) not captured by simple rules'
      : 'High GPA/achievement count not matched by essay quality or leadership indicators',
  }))
    .filter(e => e.difference >= 15)
    .sort((a, b) => b.difference - a.difference)
    .slice(0, 5);

  const dimStats: Record<string, Record<string, number>> = {};
  for (const dim of ['leadership', 'motivation', 'growth', 'communication', 'growthVelocity'] as const) {
    const scores = scored.map(s => s.scores[dim].score);
    const mean = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const sorted = [...scores].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const std = Math.round(Math.sqrt(scores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / scores.length));
    dimStats[dim] = { mean, median, std, min: sorted[0], max: sorted[sorted.length - 1] };
  }

  return {
    model_comparison: {
      spearman_correlation: rho,
      interpretation: rho >= 0.7 ? 'Strong rank agreement' : rho >= 0.4 ? 'Moderate rank agreement' : 'Low rank agreement',
      accept_reject_agreement: Math.round(
        scored.filter((s, i) => (s.shortlistRecommendation === 'STRONG_YES' || s.shortlistRecommendation === 'YES') === (baselineScores[i] >= 50)).length / n * 100
      ) / 100,
      advanced_stats: { mean: advMean, std: advStd, min: advMin, max: advMax, range: advMax - advMin },
      baseline_stats: { mean: baseMean, std: baseStd, min: baseMin, max: baseMax, range: baseMax - baseMin },
    },
    dimension_statistics: dimStats,
    recommendation_distribution: recDist,
    edge_cases: edgeCases,
    total_candidates: n,
    shortlisted_count: scored.filter(s => s.shortlistRecommendation === 'STRONG_YES' || s.shortlistRecommendation === 'YES').length,
    ai_flagged_count: scored.filter(s => s.scores.aiSuspicion.score >= 40).length,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profile = searchParams.get('profile') || 'default';

  // Try Python backend
  try {
    const res = await fetch(`${PYTHON_BACKEND}/validation?profile=${profile}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ ...data, source: 'python_nlp' });
    }
  } catch { /* fall through */ }

  // Fallback to TypeScript engine
  const report = buildValidationFromTS();
  return NextResponse.json({ success: true, data: report, source: 'typescript_fallback' });
}
