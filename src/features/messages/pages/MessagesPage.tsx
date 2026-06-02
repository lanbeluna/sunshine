import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/lib/toast';
import { WanderImage } from '@/components/media/WanderImage';
import { ProfileSubPageLayout } from '@/features/profile/components/ProfileSubPageLayout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatCommentTime } from '@/lib/feedCommentsStore';
import {
  hiddenInboxCountBySettings,
  loadInboxMessages,
  markAllInboxRead,
  markInboxMessageRead,
  visibleInboxMessages,
  type InboxChannel,
  type InboxMessage,
} from '@/lib/messagesInboxStore';
import { useAppContext } from '@/context/AppContext';
import { pickCover } from '@/lib/unsplashPools';
import { cn } from '@/lib/utils';

const CHANNEL_META: Record<InboxChannel, { label: string; emoji: string }> = {
  trip: { label: '行程提醒', emoji: '🗓️' },
  recommend: { label: '每日推荐', emoji: '✨' },
  social: { label: '互动消息', emoji: '💬' },
  system: { label: '系统通知', emoji: '⚙️' },
};

const TABS: { id: 'all' | InboxChannel; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'trip', label: '行程' },
  { id: 'recommend', label: '推荐' },
  { id: 'social', label: '互动' },
  { id: 'system', label: '系统' },
];

export default function MessagesPage() {
  const { theme } = useAppContext();
  const light = theme === 'light';
  const [bump, setBump] = useState(0);
  const [tab, setTab] = useState<'all' | InboxChannel>('all');
  const [active, setActive] = useState<InboxMessage | null>(null);

  const { rows, hiddenHint } = useMemo(() => {
    void bump;
    const all = loadInboxMessages();
    const visible = visibleInboxMessages(all);
    const filtered =
      tab === 'all' ? visible : visible.filter((m) => m.channel === tab);
    const hidden = hiddenInboxCountBySettings();
    return {
      rows: filtered,
      hiddenHint: hidden > 0,
    };
  }, [bump, tab]);

  const openDetail = (m: InboxMessage) => {
    if (!m.read) {
      markInboxMessageRead(m.id);
      setBump((b) => b + 1);
      setActive({ ...m, read: true });
      return;
    }
    setActive(m);
  };

  const onMarkAll = () => {
    markAllInboxRead();
    setBump((b) => b + 1);
    toast.success('已全部标为已读');
  };

  return (
    <ProfileSubPageLayout
      title="消息"
      right={
        <button
          type="button"
          onClick={onMarkAll}
          className={cn(
            'rounded-lg px-2 py-1.5 text-xs font-semibold transition active:scale-95',
            light ? 'text-indigo-600 hover:bg-indigo-50' : 'text-indigo-300 hover:bg-white/10'
          )}
        >
          全部已读
        </button>
      }
    >
      <div
        className={cn(
          'sticky top-0 z-10 border-b px-2 py-2 backdrop-blur-md',
          light ? 'border-zinc-200 bg-white/95' : 'border-white/10 bg-wander-bg/95'
        )}
      >
        <div className="flex gap-2 overflow-x-auto px-2 pb-1 scrollbar-none">
          {TABS.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
                  on
                    ? 'bg-indigo-500 text-white shadow-md'
                    : light
                      ? 'bg-zinc-100 text-zinc-600'
                      : 'bg-white/10 text-wander-secondary'
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pb-28 pt-3">
        {hiddenHint ? (
          <p className={cn('mb-3 rounded-xl border px-3 py-2 text-xs', light ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-amber-500/30 bg-amber-500/10 text-amber-100')}>
            部分消息因「通知设置」已关闭对应类型而未显示。{' '}
            <Link to="/profile/notifications" className="font-semibold underline underline-offset-2">
              去调整
            </Link>
          </p>
        ) : null}

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <WanderImage
              src={pickCover(`inbox-empty-${tab}`, 560, 320)}
              alt=""
              fallbackLabel="消息"
              className="mb-5 h-40 w-full max-w-[300px] overflow-hidden rounded-2xl shadow-lg shadow-black/25"
              width={560}
              height={320}
            />
            <p className={cn('text-sm', light ? 'text-zinc-600' : 'text-wander-secondary')}>
              {tab === 'all' ? '暂无消息' : '该分类下暂无消息'}
            </p>
            <Link
              to="/profile/notifications"
              className="mt-4 text-sm font-semibold text-indigo-400"
            >
              通知设置
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {rows.map((m) => {
              const meta = CHANNEL_META[m.channel];
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => openDetail(m)}
                    className={cn(
                      'flex w-full gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.99]',
                      light
                        ? 'border-zinc-200 bg-white shadow-sm hover:border-indigo-200'
                        : 'border-white/10 bg-wander-card hover:border-white/20',
                      !m.read && (light ? 'ring-1 ring-indigo-200' : 'ring-1 ring-indigo-500/35')
                    )}
                  >
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                      <WanderImage
                        src={pickCover(`inbox-row-${m.id}-${m.channel}`, 88, 88)}
                        alt=""
                        fallbackLabel={meta.label}
                        className="h-full w-full"
                        width={88}
                        height={88}
                      />
                      <span
                        className="pointer-events-none absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-tl-md bg-black/45 text-[11px] leading-none backdrop-blur-[2px]"
                        aria-hidden
                      >
                        {meta.emoji}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className={cn('text-xs font-medium', light ? 'text-indigo-600' : 'text-indigo-300')}>
                          {meta.label}
                        </span>
                        <span className={cn('shrink-0 text-[11px]', light ? 'text-zinc-400' : 'text-wander-muted')}>
                          {formatCommentTime(m.createdAt)}
                        </span>
                      </div>
                      <p className={cn('mt-0.5 font-semibold leading-snug', light ? 'text-zinc-900' : 'text-white')}>
                        {m.title}
                      </p>
                      <p className={cn('mt-1 line-clamp-2 text-sm', light ? 'text-zinc-600' : 'text-wander-secondary')}>
                        {m.body}
                      </p>
                    </div>
                    {!m.read ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-500 ring-2 ring-rose-500/30" />
                    ) : (
                      <span className="w-2 shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <p className={cn('mt-8 text-center text-[11px]', light ? 'text-zinc-400' : 'text-wander-muted')}>
          行程提醒、每日推荐、互动与系统通知会聚合在此。已读状态保存在本机。
        </p>
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          className={cn(
            'max-h-[85vh] overflow-y-auto border sm:max-w-md [&_svg]:text-current',
            light
              ? 'border-zinc-200 bg-white text-zinc-900 [&_svg]:text-zinc-700'
              : 'border-white/10 bg-wander-card text-white [&_svg]:text-white'
          )}
        >
          {active ? (
            <>
              <DialogHeader>
                <DialogTitle className={cn('text-left', light ? 'text-zinc-900' : 'text-white')}>
                  <span className="mr-2">{CHANNEL_META[active.channel].emoji}</span>
                  {active.title}
                </DialogTitle>
                <DialogDescription className={cn('text-left', light ? 'text-zinc-500' : 'text-wander-secondary')}>
                  {CHANNEL_META[active.channel].label} · {formatCommentTime(active.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className={cn('space-y-3 text-sm leading-relaxed', light ? 'text-zinc-700' : 'text-wander-secondary')}>
                {active.body.split(/\n+/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <DialogFooter className="gap-2 sm:justify-stretch">
                <Button
                  type="button"
                  variant="secondary"
                  className={cn('font-sans', light ? '' : 'border-white/15 bg-white/10 text-white hover:bg-white/15')}
                  onClick={() => setActive(null)}
                >
                  关闭
                </Button>
                <Button
                  type="button"
                  className="font-sans border-0 bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg hover:from-indigo-400 hover:to-violet-500"
                  onClick={() => setActive(null)}
                >
                  知道了
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </ProfileSubPageLayout>
  );
}
