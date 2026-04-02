import { ScoredCandidate } from '@/types';

export function getScoreColor(score: number): string {
  if (score >= 80) return '#34d399';
  if (score >= 65) return '#60a5fa';
  if (score >= 50) return '#fbbf24';
  if (score >= 35) return '#fb923c';
  return '#f87171';
}

export function getScoreClass(score: number): string {
  if (score >= 80) return 'score-exceptional';
  if (score >= 65) return 'score-strong';
  if (score >= 50) return 'score-good';
  if (score >= 35) return 'score-moderate';
  return 'score-weak';
}

export function getScoreBarClass(score: number): string {
  if (score >= 80) return 'score-bar-exceptional';
  if (score >= 65) return 'score-bar-strong';
  if (score >= 50) return 'score-bar-good';
  if (score >= 35) return 'score-bar-moderate';
  return 'score-bar-weak';
}

export function getRecommendationLabel(rec: ScoredCandidate['shortlistRecommendation']): string {
  const map = {
    STRONG_YES: '✅ Strong Yes',
    YES: '👍 Yes',
    MAYBE: '🤔 Maybe',
    NO: '❌ No',
  };
  return map[rec];
}

export function getRecommendationBadgeClass(rec: ScoredCandidate['shortlistRecommendation']): string {
  const map = {
    STRONG_YES: 'badge-strong-yes',
    YES: 'badge-yes',
    MAYBE: 'badge-maybe',
    NO: 'badge-no',
  };
  return map[rec];
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getAiSuspicionLabel(score: number): { label: string; color: string } {
  if (score >= 60) return { label: 'High', color: '#f87171' };
  if (score >= 30) return { label: 'Moderate', color: '#fbbf24' };
  return { label: 'Low', color: '#34d399' };
}
