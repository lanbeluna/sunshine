import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
};

export function Card({ padded = true, className, children, ...props }: Props) {
  return (
    <div
      className={cn(
        'ql-paper-card rounded-[var(--ql-radius-card)]',
        padded && 'p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
