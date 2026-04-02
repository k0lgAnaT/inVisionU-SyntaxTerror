import { NextRequest, NextResponse } from 'next/server';
import { scoreCandidate } from '@/lib/scoring/engine';
import { Candidate, WeightProfile } from '@/types';
import candidatesData from '@/data/candidates.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const profile = (searchParams.get('profile') || 'default') as WeightProfile;

  const candidates = candidatesData as Candidate[];
  const candidate = candidates.find(c => c.id === params.id);

  if (!candidate) {
    return NextResponse.json({ success: false, error: 'Candidate not found' }, { status: 404 });
  }

  const scored = scoreCandidate(candidate, profile);
  return NextResponse.json({ success: true, data: scored });
}
