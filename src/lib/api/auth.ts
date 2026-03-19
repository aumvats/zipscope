import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/api/supabase';

/**
 * Verify Supabase JWT from the Authorization: Bearer header.
 * Returns the authenticated userId or an error NextResponse.
 */
export async function verifySession(request: NextRequest): Promise<{ userId: string } | NextResponse> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const supabase = createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
  return { userId: user.id };
}
