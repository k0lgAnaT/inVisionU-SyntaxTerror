import { NextRequest, NextResponse } from 'next/server';
import { scoreAllCandidates, scoreCandidate } from '@/lib/scoring/engine';
import { Candidate, WeightProfile } from '@/types';
import candidatesData from '@/data/candidates.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profile = (searchParams.get('profile') || 'default') as WeightProfile;

  const candidates = candidatesData as Candidate[];
  const scored = scoreAllCandidates(candidates, profile);

  return NextResponse.json({ success: true, data: scored, count: scored.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidate, profile = 'default' } = body as { candidate: Candidate; profile: WeightProfile };

    if (!candidate || !candidate.essay) {
      return NextResponse.json({ success: false, error: 'Missing candidate data or essay' }, { status: 400 });
    }

    const scored = scoreCandidate(candidate, profile);
    return NextResponse.json({ success: true, data: scored });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}
