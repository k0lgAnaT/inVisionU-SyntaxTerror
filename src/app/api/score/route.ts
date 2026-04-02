import { NextRequest, NextResponse } from 'next/server';
import { scoreAllCandidates } from '@/lib/scoring/engine';
import { Candidate, WeightProfile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidates, profile = 'default' } = body as {
      candidates: Candidate[];
      profile: WeightProfile;
    };

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ success: false, error: 'No candidates provided' }, { status: 400 });
    }

    // Validate each candidate has required fields
    for (const c of candidates) {
      if (!c.name || !c.essay) {
        return NextResponse.json({
          success: false,
          error: `Candidate "${c.name || 'unknown'}" is missing required fields (name, essay)`,
        }, { status: 400 });
      }
      // Auto-assign ID if missing
      if (!c.id) c.id = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const scored = scoreAllCandidates(candidates, profile);
    return NextResponse.json({ success: true, data: scored, count: scored.length });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body or parsing error' }, { status: 400 });
  }
}
