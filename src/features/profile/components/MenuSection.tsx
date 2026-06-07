import type { ReactNode } from 'react';
import { useAppContext } from '@/context/useAppContext';
import { cn } from '@/lib/utils';

export function MenuSection({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <div>
      <h3
        className={cn(
          'mb-2 px-1 text-xs font-semibold tracking-wider',
          light ? 'text-zinc-500' : 'text-white/40'
        )}
      >
        {title}
      </h3>
      <div
        className={cn(
          'overflow-hidden rounded-[1.35rem] border shadow-ql-card',
          light ? 'border-zinc-200/90 bg-white' : 'border-white/[0.08] bg-[#17171A]/95'
        )}
      >
        {children}
      </div>
    </div>
  );
}
