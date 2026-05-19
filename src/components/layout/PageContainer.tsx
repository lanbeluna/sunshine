import type { ReactNode } from 'react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

/** 底部 Tab 64px + 安全区 + 中间 FAB 预留 */
const bottomPad = 'calc(5.5rem + env(safe-area-inset-bottom, 0px))';

export function PageContainer({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <div
      className={cn(
        'min-h-dvh',
        light ? 'bg-zinc-100 text-zinc-900' : 'bg-wander-bg text-white',
        className
      )}
      style={{ paddingBottom: bottomPad }}
    >
      {children}
    </div>
  );
}
