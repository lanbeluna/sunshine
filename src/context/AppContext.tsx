import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppContext, type AppLanguage, type QlAppTheme } from '@/context/appContextCore';

const THEME_KEY = 'ql_theme';
const THEME_LEGACY = 'wander-theme';
const LANG_KEY = 'ql_language';
const LANG_LEGACY = 'wanderai_language';

function readStoredTheme(): QlAppTheme {
  try {
    let v = localStorage.getItem(THEME_KEY);
    if (!v) v = localStorage.getItem(THEME_LEGACY);
    if (v && !localStorage.getItem(THEME_KEY) && localStorage.getItem(THEME_LEGACY)) {
      localStorage.setItem(THEME_KEY, v);
    }
    return v === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function readStoredLanguage(): AppLanguage {
  try {
    let v = localStorage.getItem(LANG_KEY);
    if (!v) v = localStorage.getItem(LANG_LEGACY);
    if (v && !localStorage.getItem(LANG_KEY) && localStorage.getItem(LANG_LEGACY)) {
      localStorage.setItem(LANG_KEY, v);
    }
    return v === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<QlAppTheme>(readStoredTheme);
  const [language, setLanguageState] = useState<AppLanguage>(readStoredLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, language);
    } catch {
      /* ignore */
    }
  }, [language]);

  const setLanguage = useCallback((l: AppLanguage) => {
    setLanguageState(l);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      language,
      setLanguage,
    }),
    [theme, toggleTheme, language, setLanguage]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
