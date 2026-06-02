import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  /** 主内容底部留白（避开底栏） */
  className?: string;
};

export function ProfileSubPageLayout({ title, right, children, className }: Props) {
  const navigate = useNavigate();
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <PageContainer className={className}>
      <header
        className={cn(
          'grid grid-cols-[2.5rem_1fr_2.5rem] items-center border-b px-2 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]',
          light ? 'border-zinc-200 bg-white/80' : 'border-white/10 bg-wander-bg/90'
        )}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full transition active:scale-95',
            light ? 'bg-zinc-100 text-zinc-800' : 'bg-white/10 text-white'
          )}
          aria-label="返回"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className={cn('truncate text-center text-lg font-bold tracking-tight', light ? 'text-zinc-900' : 'text-white')}>
          {title}
        </h1>
        <div className="flex min-h-10 justify-end">{right}</div>
      </header>
      {children}
    </PageContainer>
  );
}
