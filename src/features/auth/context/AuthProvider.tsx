import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { AuthContext } from '@/features/auth/context/authContextCore';
import {
  getCurrentAuthSession,
  isRealEmailUser,
  isSupabaseAuthAvailable,
  signInWithEmail,
  signOutCurrentUser,
  signUpWithEmail,
  type AuthResult,
} from '@/services/supabase/auth';
import { getSupabase } from '@/services/supabase/client';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isConfigured] = useState(() => isSupabaseAuthAvailable());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabase();

    if (!supabase) {
      return undefined;
    }

    getCurrentAuthSession()
      .then((current) => {
        if (!mounted) return;
        setSession(current);
        setUser(current?.user ?? null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : '读取登录状态失败。');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setError(null);
    const result = await signInWithEmail(email, password);
    if (!result.ok) setError(result.error);
    return result;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, emailRedirectTo?: string): Promise<AuthResult> => {
      setError(null);
      const result = await signUpWithEmail(email, password, emailRedirectTo);
      if (!result.ok) setError(result.error);
      return result;
    },
    []
  );

  const signOut = useCallback(async () => {
    setError(null);
    const result = await signOutCurrentUser();
    if (!result.ok) setError(result.error);
    return result;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      error,
      isConfigured,
      isAuthenticated: isRealEmailUser(user),
      signIn,
      signUp,
      signOut,
      clearError,
    }),
    [session, user, loading, error, isConfigured, signIn, signUp, signOut, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
