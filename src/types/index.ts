export interface Candidate {
  id: string;
  name: string;
  age: number;
  city: string;
  school: string;
  gpa: number;
  submittedAt: string;
  essay: string;
  experience: string[];
  achievements: string[];
  languages: string[];
  socialLinks: Record<string, string>;
  videoStatement: boolean;
  references: number;
  extracurricular: string;
}

export interface DimensionScore {
  score: number;
  label: string;
  explanation: string;
  evidence: string[];
}

export interface ScoredCandidate {
  candidate: Candidate;
  scores: {
    leadership: DimensionScore;
    motivation: DimensionScore;
    growth: DimensionScore;
    communication: DimensionScore;
    aiSuspicion: DimensionScore;
    growthVelocity: DimensionScore;
  };
  totalScore: number;
  rank?: number;
  flags: string[];
  securityFlags: string[];
  shortlistRecommendation: 'STRONG_YES' | 'YES' | 'MAYBE' | 'NO';
  smartQuestions: string[];
  cohortPercentile?: number;
}

export type WeightProfile = 'default' | 'leadership' | 'authenticity' | 'potential';
