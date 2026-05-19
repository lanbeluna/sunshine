import type { ReactNode } from 'react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export function MenuSection({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <div>
      <h3
        className={cn(
          'mb-2 px-1 text-xs font-semibold uppercase tracking-wider',
          light ? 'text-zinc-500' : 'text-wander-muted'
        )}
      >
        {title}
      </h3>
      <div
        className={cn(
          'overflow-hidden rounded-2xl border',
          light ? 'border-zinc-200/90 bg-white' : 'border-white/10 bg-wander-card'
        )}
      >
        {children}
      </div>
    </div>
  );
}
