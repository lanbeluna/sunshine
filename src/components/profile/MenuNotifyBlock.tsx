import { Bell, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/lib/toast';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';

export function MenuNotifyBlock() {
  const { theme } = useAppContext();
  const light = theme === 'light';
  const [open, setOpen] = useState(false);
  const [trip, setTrip] = useState(true);
  const [daily, setDaily] = useState(true);
  const [social, setSocial] = useState(false);

  return (
    <div
      className={cn(
        'border-b border-white/10 last:border-b-0',
        light && 'border-zinc-100'
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-3 px-4 py-3.5 text-left transition',
          light ? 'active:bg-zinc-100' : 'active:bg-white/5'
        )}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-wander-brand">
          <Bell className="h-5 w-5" />
        </span>
        <span className={cn('min-w-0 flex-1 text-sm font-medium', light ? 'text-zinc-900' : 'text-white')}>
          通知设置
        </span>
        <ChevronRight
          className={cn('h-5 w-5 shrink-0 text-wander-muted transition-transform', open && 'rotate-90')}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          className={cn(
            'space-y-1 border-t px-4 py-3',
            light ? 'border-zinc-100 bg-zinc-50/80' : 'border-white/10 bg-black/25'
          )}
        >
          {[
            ['行程提醒', trip, setTrip] as const,
            ['每日推荐', daily, setDaily] as const,
            ['互动消息', social, setSocial] as const,
          ].map(([label, on, set]) => (
            <div key={label} className="flex items-center justify-between gap-3 py-2">
              <span className={cn('text-sm', light ? 'text-zinc-700' : 'text-wander-secondary')}>{label}</span>
              <Switch
                checked={on}
                onCheckedChange={(c) => {
                  set(Boolean(c));
                  toast.message(c ? `已开启：${label}` : `已关闭：${label}`);
                }}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
