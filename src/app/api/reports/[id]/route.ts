import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/api/supabase';
import { verifySession } from '@/lib/api/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifySession(request);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifySession(request);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', params.id)
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
