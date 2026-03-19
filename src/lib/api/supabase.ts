import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Get Authorization headers for authenticated API requests from the browser.
 * Returns an empty object if no session is active.
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createBrowserSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return {};
  return { 'Authorization': `Bearer ${session.access_token}` };
}

export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase server environment variables are not configured');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
