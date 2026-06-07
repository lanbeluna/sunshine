import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { AuthResult } from '@/services/supabase/auth';

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<{ ok: true } | { ok: false; error: string }>;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
