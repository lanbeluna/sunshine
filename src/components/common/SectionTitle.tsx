import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionTitle({ eyebrow, title, description, action, className }: Props) {
  return (
    <div className={cn('flex items-end justify-between gap-3', className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--ql-accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-lg font-black tracking-tight text-[var(--ql-ink)]">{title}</h2>
        {description ? <p className="mt-1 text-xs leading-relaxed text-[var(--ql-muted)]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
