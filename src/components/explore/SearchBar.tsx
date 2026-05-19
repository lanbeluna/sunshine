import { MessageCircle, RefreshCw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onRefresh?: () => void;
  /** 点击消息：用于清除未读等 */
  onMessageClick?: () => void;
  /** 是否显示未读红点 */
  hasUnread?: boolean;
};

export function SearchBar({ value, onChange, onRefresh, onMessageClick, hasUnread = true }: Props) {
  return (
    <div className="sticky top-0 z-20 border-b border-wander-border/80 bg-wander-bg/90 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-wander-muted" />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="搜索目的地、攻略、美食..."
            className="h-11 w-full rounded-full border border-transparent bg-wander-surface py-2 pl-10 pr-4 text-sm text-white placeholder:text-wander-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-wander-brand/50"
            enterKeyHint="search"
          />
        </label>
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wander-surface text-wander-secondary transition active:scale-[0.96] active:bg-white/10"
            aria-label="换一批内容"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onMessageClick?.()}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wander-surface text-wander-secondary transition active:scale-[0.96] active:bg-white/10"
          aria-label="消息"
        >
          <MessageCircle className="h-5 w-5" />
          <span
            className={cn(
              'absolute right-2 top-2 h-2 w-2 rounded-full bg-wander-error ring-2 ring-wander-bg transition-opacity',
              !hasUnread && 'opacity-0'
            )}
          />
        </button>
      </div>
    </div>
  );
}
