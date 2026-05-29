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
    <div className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#0b0b0e]/90 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-wander-coral">QL轻旅</p>
          <h1 className="mt-1 truncate text-[22px] font-black tracking-tight text-white">今天想去哪儿？</h1>
        </div>
        <p className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/75">
          灵感地图
        </p>
      </div>
      <div className="flex items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="搜索目的地、攻略、美食…"
            className="ql-focus h-11 w-full rounded-full border border-white/[0.08] bg-white/[0.08] py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 transition-colors focus:border-wander-coral/40 focus:bg-white/[0.11]"
            enterKeyHint="search"
            aria-label="搜索目的地、攻略、美食"
          />
        </label>
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            className="ql-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.08] text-white/70 transition-colors active:scale-[0.96] active:bg-white/10"
            aria-label="换一批内容"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onMessageClick?.()}
          className="ql-focus relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.08] text-white/70 transition-colors active:scale-[0.96] active:bg-white/10"
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
