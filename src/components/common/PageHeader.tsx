import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/common/Card';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, action, className }: Props) {
  return (
    <header className={cn('px-4 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))]', className)}>
      <Card className="overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--ql-accent)]">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-1 text-2xl font-black tracking-tight text-[var(--ql-ink)]">{title}</h1>
            {description ? (
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--ql-muted)]">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </Card>
    </header>
  );
}
