import { createContext } from 'react';

export type QlAppTheme = 'dark' | 'light';
export type AppLanguage = 'zh' | 'en';

export type AppContextValue = {
  theme: QlAppTheme;
  setTheme: (t: QlAppTheme) => void;
  toggleTheme: () => void;
  language: AppLanguage;
  setLanguage: (l: AppLanguage) => void;
};

export const AppContext = createContext<AppContextValue | null>(null);
