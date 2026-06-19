import { MessageCircle, RefreshCw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onRefresh?: () => void;
  onMessageClick?: () => void;
  hasUnread?: boolean;
};

export function SearchBar({ value, onChange, onRefresh, onMessageClick, hasUnread = true }: Props) {
  return (
    <div className="sticky top-0 z-20 border-b border-white/70 bg-white/78 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-sm shadow-rose-100/40 backdrop-blur-xl">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-wander-coral">QL轻旅</p>
          <h1 className="mt-1 truncate text-[22px] font-black tracking-tight text-slate-950">今天想去哪儿？</h1>
        </div>
        <p className="shrink-0 rounded-full border border-white/80 bg-white/65 px-2.5 py-1 text-[11px] font-bold text-slate-600 shadow-sm">
          灵感地图
        </p>
      </div>
      <div className="flex items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="搜索目的地、攻略、美食..."
            className="ql-focus h-11 w-full rounded-full border border-white/80 bg-white/72 py-2 pl-10 pr-4 text-sm font-semibold text-slate-800 shadow-sm placeholder:text-slate-400 transition-colors focus:border-wander-coral/40 focus:bg-white"
            enterKeyHint="search"
            aria-label="搜索目的地、攻略、美食"
          />
        </label>
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            className="ql-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/72 text-slate-500 shadow-sm transition-colors active:scale-[0.96] active:bg-white"
            aria-label="换一批内容"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onMessageClick?.()}
          className="ql-focus relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/72 text-slate-500 shadow-sm transition-colors active:scale-[0.96] active:bg-white"
          aria-label="消息"
        >
          <MessageCircle className="h-5 w-5" />
          <span
            className={cn(
              'absolute right-2 top-2 h-2 w-2 rounded-full bg-wander-error ring-2 ring-white transition-opacity',
              !hasUnread && 'opacity-0'
            )}
          />
        </button>
      </div>
    </div>
  );
}
