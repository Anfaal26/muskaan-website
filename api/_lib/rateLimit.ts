import { getSupabaseAdmin } from './supabaseAdmin';

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export async function checkRateLimit(ip: string): Promise<{ blocked: boolean }> {
  const db = getSupabaseAdmin();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const { count } = await db
    .from('login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .eq('success', false)
    .gte('attempted_at', since);

  return { blocked: (count ?? 0) >= MAX_ATTEMPTS };
}

export async function recordAttempt(ip: string, success: boolean): Promise<void> {
  const db = getSupabaseAdmin();
  await db.from('login_attempts').insert({ ip, success });
}

export async function clearAttempts(ip: string): Promise<void> {
  const db = getSupabaseAdmin();
  await db.from('login_attempts').delete().eq('ip', ip);
}
