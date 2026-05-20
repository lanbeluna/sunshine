import { WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export function OfflineNotice() {
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);

  useEffect(() => {
    const setOnline = () => setOffline(false);
    const setOfflineState = () => setOffline(true);

    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOfflineState);
    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOfflineState);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-[max(0.75rem,env(safe-area-inset-top))] z-[250] w-[calc(100%-1.5rem)] max-w-[400px] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-2xl border border-amber-300/25 bg-zinc-950/90 px-3 py-2 text-xs font-medium text-amber-100 shadow-lg shadow-black/25 backdrop-blur">
        <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
        <span>当前网络不可用，已打开的内容仍可浏览，云端同步会在恢复网络后继续。</span>
      </div>
    </div>
  );
}
