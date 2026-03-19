import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/api/supabase';
import { checkAnonymousRateLimit } from '@/lib/utils/rateLimit';

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const userId = authHeader?.replace('Bearer ', '');

  if (!userId) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const result = checkAnonymousRateLimit(ip);
    return NextResponse.json({ count: result.count, limit: result.limit, plan: 'free' });
  }

  const supabase = createServerSupabaseClient();
  const month = getCurrentMonth();

  const { data } = await supabase
    .from('usage')
    .select('lookup_count')
    .eq('user_id', userId)
    .eq('month', month)
    .single();

  return NextResponse.json({
    count: data?.lookup_count || 0,
    limit: 10, // free tier default
    plan: 'free',
  });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const userId = authHeader?.replace('Bearer ', '');

  if (!userId) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const result = checkAnonymousRateLimit(ip);
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Daily lookup limit reached. Sign up for more lookups.' },
        { status: 429 }
      );
    }
    return NextResponse.json({ count: result.count, limit: result.limit, plan: 'free' });
  }

  const supabase = createServerSupabaseClient();
  const month = getCurrentMonth();

  // Upsert usage record
  const { data: existing } = await supabase
    .from('usage')
    .select('lookup_count')
    .eq('user_id', userId)
    .eq('month', month)
    .single();

  const currentCount = existing?.lookup_count || 0;
  const limit = 10; // free tier

  if (currentCount >= limit) {
    return NextResponse.json(
      { error: 'Monthly lookup limit reached. Upgrade to Pro for unlimited lookups.' },
      { status: 429 }
    );
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from('usage')
      .update({ lookup_count: currentCount + 1 })
      .eq('user_id', userId)
      .eq('month', month);
    if (updateError) {
      console.error('[usage] Failed to increment usage for user', userId, updateError);
      return NextResponse.json({ error: 'Failed to record usage' }, { status: 500 });
    }
  } else {
    const { error: insertError } = await supabase
      .from('usage')
      .insert({ user_id: userId, month, lookup_count: 1 });
    if (insertError) {
      console.error('[usage] Failed to create usage record for user', userId, insertError);
      return NextResponse.json({ error: 'Failed to record usage' }, { status: 500 });
    }
  }

  return NextResponse.json({ count: currentCount + 1, limit, plan: 'free' });
}
