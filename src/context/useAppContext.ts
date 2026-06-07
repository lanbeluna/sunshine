import { useContext } from 'react';
import { AppContext, type AppLanguage, type QlAppTheme } from '@/context/appContextCore';

export type { AppLanguage, QlAppTheme };

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
