import { NextRequest, NextResponse } from 'next/server';
import { fetchZipInfo, emptyZipInfo } from '@/lib/api/zippopotam';

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get('zip');

  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Invalid ZIP code. Please provide a 5-digit US ZIP.' }, { status: 400 });
  }

  try {
    const info = await fetchZipInfo(zip);
    return NextResponse.json(info);
  } catch {
    return NextResponse.json(emptyZipInfo(zip));
  }
}
