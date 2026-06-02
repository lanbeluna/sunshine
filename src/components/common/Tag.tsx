import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = HTMLAttributes<HTMLSpanElement> & {
  icon?: ReactNode;
};

export function Tag({ icon, className, children, ...props }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-[var(--ql-card-border)] bg-[var(--ql-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--ql-muted)]',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
