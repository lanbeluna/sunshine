import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAppContext } from '@/context/useAppContext';
import { cn } from '@/lib/utils';

type Props = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  trailing?: ReactNode;
  /** 分组内最后一行可去掉底部分割�?*/
  noDivider?: boolean;
};

export function MenuRowButton({ icon, title, subtitle, onClick, trailing, noDivider }: Props) {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'ql-focus flex min-h-[58px] w-full items-center gap-3 border-b px-4 py-3.5 text-left transition-colors active:bg-white/5',
        light ? 'border-zinc-100 active:bg-zinc-100' : 'border-white/10 active:bg-white/5',
        noDivider && 'border-b-0'
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wander-coral/10 text-wander-coral">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className={cn('block text-sm font-medium', light ? 'text-zinc-900' : 'text-white')}>{title}</span>
        {subtitle ? (
          <span className={cn('mt-0.5 block text-xs', light ? 'text-zinc-500' : 'text-white/40')}>{subtitle}</span>
        ) : null}
      </span>
      {trailing ?? (
        <ChevronRight className={cn('h-5 w-5 shrink-0', light ? 'text-zinc-400' : 'text-white/32')} aria-hidden />
      )}
    </button>
  );
}
