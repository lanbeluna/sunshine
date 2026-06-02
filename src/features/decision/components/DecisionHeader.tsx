import { Bell } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

type Props = {
  onNotifyClick?: () => void;
  /** 是否有未读消息（与探索页消息入口共用收件箱） */
  hasUnread?: boolean;
};

export function DecisionHeader({ onNotifyClick, hasUnread = true }: Props) {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <header className="flex items-center justify-between px-4 pb-3 pt-safe">
      <h1 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
        QL轻旅
      </h1>
      <button
        type="button"
        onClick={onNotifyClick}
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-full transition active:scale-[0.96]',
          light
            ? 'border border-indigo-200/80 bg-white text-indigo-600 shadow-sm active:bg-indigo-50'
            : 'bg-wander-surface text-wander-secondary active:bg-white/10',
          hasUnread && !light && 'shadow-[0_0_0_1px_rgba(129,140,248,0.35)]',
          hasUnread && light && 'shadow-[0_0_0_1px_rgba(129,140,248,0.45)]'
        )}
        aria-label="通知"
      >
        {hasUnread ? (
          <>
            <span
              className={cn(
                'pointer-events-none absolute inset-0 rounded-full animate-wander-bell-halo',
                light ? 'bg-indigo-400/15' : 'bg-indigo-500/20'
              )}
            />
            <span
              className={cn(
                'pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br blur-md',
                light ? 'from-indigo-400/20 to-violet-400/15' : 'from-indigo-400/30 to-violet-500/20'
              )}
            />
          </>
        ) : null}
        <Bell className="relative z-[1] h-5 w-5" />
        <span
          className={cn(
            'absolute right-2 top-2 z-[1] h-2 w-2 rounded-full bg-wander-error ring-2 transition-opacity',
            light ? 'ring-white' : 'ring-wander-bg',
            !hasUnread && 'opacity-0'
          )}
        />
      </button>
    </header>
  );
}
