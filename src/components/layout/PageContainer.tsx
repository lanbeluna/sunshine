import type { ReactNode } from 'react';
import { useAppContext } from '@/context/useAppContext';
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
        light ? 'ql-soft-surface text-zinc-900' : 'ql-soft-surface text-white',
        className
      )}
      style={{ paddingBottom: bottomPad }}
    >
      {children}
    </div>
  );
}
