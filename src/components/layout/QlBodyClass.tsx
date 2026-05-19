import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

/** 全局 body 主题类（原在 AppShell 内，现保证无壳路由如 /assistant 也有一致基底） */
export function QlBodyClass() {
  const { theme } = useAppContext();
  const light = theme === 'light';

  useEffect(() => {
    document.body.classList.add('ql-app');
    document.body.classList.toggle('ql-light', light);
    return () => {
      document.body.classList.remove('ql-app', 'ql-light');
    };
  }, [light]);

  return null;
}
