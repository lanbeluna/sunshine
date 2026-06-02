import type { SupabaseClient } from '@supabase/supabase-js';

export async function ensureSupabaseSession(
  supabase: SupabaseClient
): Promise<{ userId: string } | null> {
  const {
    data: { session: existing },
  } = await supabase.auth.getSession();
  if (existing?.user?.id) {
    return { userId: existing.user.id };
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.warn('[supabase] Anonymous sign-in failed:', error.message);
    return null;
  }
  if (data.user?.id) {
    return { userId: data.user.id };
  }
  return null;
}
