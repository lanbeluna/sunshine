import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type AppCardProps = HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
  interactive?: boolean;
};

export function AppCard({ className, padded = true, interactive = false, ...props }: AppCardProps) {
  return (
    <div
      className={cn(
        'ql-paper-card rounded-[var(--ql-radius-card)]',
        padded && 'p-4',
        interactive && 'transition-[background,transform,box-shadow] active:scale-[0.99] hover:bg-white/[0.1]',
        className
      )}
      {...props}
    />
  );
}
