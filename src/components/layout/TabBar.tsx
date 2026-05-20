import { BookOpen, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AppTab = 'books' | 'new' | 'profile';

export type TabBarProps = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
};

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[55] border-t border-pencil/30 bg-paper/75 safe-bottom backdrop-blur-md'
      )}
      aria-label="主导航"
    >
      <div className="relative mx-auto flex min-h-[3.75rem] w-full max-w-[430px] items-end justify-between px-8 pb-1 pt-1">
        <button
          type="button"
          onClick={() => onChange('books')}
          className={cn(
            'flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-xs transition-colors',
            active === 'books' ? 'text-ink' : 'text-inkLight'
          )}
        >
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-[box-shadow,background-color]',
              active === 'books' && 'bg-mint/25 shadow-[0_0_0_2px_rgba(168,213,186,0.65)]'
            )}
          >
            <BookOpen className="h-5 w-5" strokeWidth={active === 'books' ? 2.25 : 1.75} />
          </span>
          <span className="font-medium">手账本</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('profile')}
          className={cn(
            'flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-xs transition-colors',
            active === 'profile' ? 'text-ink' : 'text-inkLight'
          )}
        >
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-[box-shadow,background-color]',
              active === 'profile' && 'bg-mint/25 shadow-[0_0_0_2px_rgba(168,213,186,0.65)]'
            )}
          >
            <User className="h-5 w-5" strokeWidth={active === 'profile' ? 2.25 : 1.75} />
          </span>
          <span className="font-medium">我的</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('new')}
          className={cn(
            'absolute left-1/2 top-[-1.125rem] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-paper bg-mint text-ink shadow-warm transition-[transform,box-shadow] hover:scale-[1.03] active:scale-[0.98]',
            active === 'new' && 'ring-2 ring-mint ring-offset-2 ring-offset-paper'
          )}
          aria-label="新建手账"
        >
          <Plus className="h-7 w-7" strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
}
