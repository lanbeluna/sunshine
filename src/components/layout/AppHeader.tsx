import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  elevated?: boolean;
  className?: string;
};

export function AppHeader({
  title,
  showBack = false,
  onBack,
  right,
  elevated = false,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[60] grid h-14 grid-cols-[2.75rem_1fr_auto] items-center gap-1 border-b border-pencil/25 bg-paper/80 px-1 backdrop-blur-md transition-shadow duration-200',
        elevated ? 'shadow-warm' : 'shadow-none',
        className
      )}
    >
      <div className="flex justify-start">
        {showBack ? (
          <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ) : (
          <span className="inline-block w-10" aria-hidden />
        )}
      </div>
      <h1 className="min-w-0 truncate text-center font-hand text-xl text-ink">{title}</h1>
      <div className="flex min-h-10 min-w-[2.75rem] items-center justify-end gap-1 pr-1">{right}</div>
    </header>
  );
}
