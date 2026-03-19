import { NextRequest, NextResponse } from 'next/server';
import { fetchCensusData } from '@/lib/api/census';

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get('zip');

  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Invalid ZIP code. Please provide a 5-digit US ZIP.' }, { status: 400 });
  }

  try {
    const data = await fetchCensusData(zip);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[census] fetchCensusData failed for ZIP', zip, err);
    return NextResponse.json({ error: 'Census data temporarily unavailable. Please try again.' }, { status: 503 });
  }
}
