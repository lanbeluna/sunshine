import type { AuthError, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { getSupabase } from '@/services/supabase/client';

export type AuthResult =
  | { ok: true; session: Session | null; user: User | null; message?: string }
  | { ok: false; error: string };

function errorMessage(error: AuthError | Error | null | unknown): string {
  if (!error) return '认证请求失败，请稍后再试。';
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return '认证请求失败，请稍后再试。';
}

export function isSupabaseAuthAvailable(): boolean {
  return getSupabase() !== null;
}

export async function getCurrentAuthSession(): Promise<Session | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: '当前未配置 Supabase，登录功能不可用。' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) return { ok: false, error: errorMessage(error) };
  return { ok: true, session: data.session, user: data.user };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  emailRedirectTo?: string
): Promise<AuthResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: '当前未配置 Supabase，注册功能不可用。' };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: emailRedirectTo ? { emailRedirectTo } : undefined,
  });

  if (error) return { ok: false, error: errorMessage(error) };

  return {
    ok: true,
    session: data.session,
    user: data.user,
    message: data.session ? undefined : '注册成功，请先到邮箱完成确认后再登录。',
  };
}

export async function signOutCurrentUser(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: true };

  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, error: errorMessage(error) };
  return { ok: true };
}

export function isRealEmailUser(user: User | null): boolean {
  if (!user?.email) return false;
  return (user as User & { is_anonymous?: boolean }).is_anonymous !== true;
}

export async function ensureAnonymousSession(
  supabase: SupabaseClient
): Promise<{ userId: string } | null> {
  try {
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
  } catch (error) {
    console.warn('[supabase] Session check failed:', error instanceof Error ? error.message : error);
    return null;
  }
}
