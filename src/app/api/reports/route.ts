import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/api/supabase';
import { verifySession } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
  const auth = await verifySession(request);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('zipscope_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to load reports' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await verifySession(request);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  const body = await request.json();
  const { zip_code, city, state, data_snapshot, report_type } = body;

  if (!zip_code || !data_snapshot) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // Check report limit (free: 5, pro: 50)
  const { count, error: countError } = await supabase
    .from('zipscope_reports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (countError) {
    return NextResponse.json({ error: 'Failed to check report limit' }, { status: 500 });
  }

  const limit = 5; // free tier default
  if ((count ?? 0) >= limit) {
    return NextResponse.json(
      { error: `Report limit reached (${limit}). Upgrade for more.` },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from('zipscope_reports')
    .insert({
      user_id: userId,
      zip_code,
      city: city || null,
      state: state || null,
      data_snapshot,
      report_type: report_type || 'single',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
