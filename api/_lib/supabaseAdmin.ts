import { createClient } from '@supabase/supabase-js';

/** Server-side Supabase client that bypasses RLS using the service role key. */
export function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase environment variables not configured');
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
