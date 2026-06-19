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
import { pickCover } from '@/lib/unsplashPools';
import { cn } from '@/lib/utils';

const CHANNEL_META: Record<InboxChannel, { label: string; emoji: string }> = {
  trip: { label: '行程提醒', emoji: '📅' },
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
  const [bump, setBump] = useState(0);
  const [tab, setTab] = useState<'all' | InboxChannel>('all');
  const [active, setActive] = useState<InboxMessage | null>(null);

  const { rows, hiddenHint } = useMemo(() => {
    void bump;
    const all = loadInboxMessages();
    const visible = visibleInboxMessages(all);
    const filtered = tab === 'all' ? visible : visible.filter((message) => message.channel === tab);
    return {
      rows: filtered,
      hiddenHint: hiddenInboxCountBySettings() > 0,
    };
  }, [bump, tab]);

  const openDetail = (message: InboxMessage) => {
    if (!message.read) {
      markInboxMessageRead(message.id);
      setBump((value) => value + 1);
      setActive({ ...message, read: true });
      return;
    }
    setActive(message);
  };

  const onMarkAll = () => {
    markAllInboxRead();
    setBump((value) => value + 1);
    toast.success('已全部标为已读');
  };

  return (
    <ProfileSubPageLayout
      title="消息"
      right={
        <button
          type="button"
          onClick={onMarkAll}
          className="ql-focus rounded-full px-3 py-1.5 text-xs font-semibold text-wander-brand transition-colors active:bg-wander-coral/10"
        >
          全部已读
        </button>
      }
    >
      <div className="sticky top-0 z-10 border-b border-[var(--ql-card-border)] bg-[var(--ql-bg)]/90 px-2 py-2 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto px-2 pb-1 scrollbar-none">
          {TABS.map((item) => {
            const activeTab = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  'ql-focus shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  activeTab
                    ? 'bg-wander-brand text-white shadow-md shadow-indigo-200/50'
                    : 'bg-white/80 text-[var(--ql-muted)] ring-1 ring-[var(--ql-card-border)]'
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pb-28 pt-3">
        {hiddenHint ? (
          <p className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
            部分消息因「通知设置」关闭了对应类型而未显示。
            <Link to="/profile/notifications" className="ml-1 font-semibold underline underline-offset-2">
              去调整
            </Link>
          </p>
        ) : null}

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <WanderImage
              src={pickCover(`inbox-empty-${tab}`, 560, 320)}
              alt="空消息状态"
              fallbackLabel="消息"
              className="mb-5 h-40 w-full max-w-[300px] overflow-hidden rounded-3xl shadow-lg shadow-rose-100/70"
              width={560}
              height={320}
            />
            <p className="text-sm text-[var(--ql-muted)]">{tab === 'all' ? '暂无消息' : '该分类下暂无消息'}</p>
            <Link to="/profile/notifications" className="mt-4 text-sm font-semibold text-wander-brand">
              通知设置
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {rows.map((message) => {
              const meta = CHANNEL_META[message.channel];
              return (
                <li key={message.id}>
                  <button
                    type="button"
                    onClick={() => openDetail(message)}
                    className={cn(
                      'ql-focus flex w-full gap-3 rounded-3xl border bg-white/88 p-3.5 text-left shadow-sm transition-transform active:scale-[0.99]',
                      message.read ? 'border-white/80' : 'border-indigo-200 ring-1 ring-indigo-100'
                    )}
                  >
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-white">
                      <WanderImage
                        src={pickCover(`inbox-row-${message.id}-${message.channel}`, 88, 88)}
                        alt=""
                        fallbackLabel={meta.label}
                        className="h-full w-full"
                        width={88}
                        height={88}
                      />
                      <span className="pointer-events-none absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-tl-lg bg-white/75 text-[11px] leading-none backdrop-blur" aria-hidden>
                        {meta.emoji}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-wander-brand">{meta.label}</span>
                        <span className="shrink-0 text-[11px] text-[var(--ql-muted)]">{formatCommentTime(message.createdAt)}</span>
                      </div>
                      <p className="mt-0.5 font-bold leading-snug text-[var(--ql-ink)]">{message.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--ql-muted)]">{message.body}</p>
                    </div>
                    {!message.read ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-500 ring-4 ring-rose-100" /> : <span className="w-2 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-8 text-center text-[11px] leading-relaxed text-[var(--ql-muted)]">
          行程提醒、每日推荐、互动与系统通知会集中显示在这里。已读状态保存在本机浏览器。
        </p>
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-[var(--ql-card-border)] bg-white text-[var(--ql-ink)] sm:max-w-md [&_svg]:text-current">
          {active ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-left text-[var(--ql-ink)]">
                  <span className="mr-2">{CHANNEL_META[active.channel].emoji}</span>
                  {active.title}
                </DialogTitle>
                <DialogDescription className="text-left text-[var(--ql-muted)]">
                  {CHANNEL_META[active.channel].label} · {formatCommentTime(active.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm leading-relaxed text-[var(--ql-muted)]">
                {active.body.split(/\n+/).map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>
              <DialogFooter className="gap-2 sm:justify-stretch">
                <Button type="button" variant="secondary" className="font-sans" onClick={() => setActive(null)}>
                  关闭
                </Button>
                <Button type="button" className="font-sans border-0 bg-gradient-to-r from-wander-coral to-sky-400 text-white shadow-lg" onClick={() => setActive(null)}>
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
