import type { ReactNode } from 'react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

/** Bottom tab, center action button, and iOS/Android safe area. */
const bottomPad = 'calc(6.75rem + env(safe-area-inset-bottom, 0px))';

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
