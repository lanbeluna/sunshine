import { pickPortrait } from '@/lib/unsplashPools';
import { buildSeedComments } from '@/lib/feedPostContent';
import type { FeedComment } from '@/types/feed';

const KEY = 'ql_feed_comments';
const KEY_LEGACY = 'wanderai_feed_comments';

type Persist = Record<string, FeedComment[]>;

function read(): Persist {
  if (typeof window === 'undefined') return {};
  try {
    let raw = localStorage.getItem(KEY);
    if (!raw) raw = localStorage.getItem(KEY_LEGACY);
    if (raw && !localStorage.getItem(KEY) && localStorage.getItem(KEY_LEGACY)) {
      try {
        localStorage.setItem(KEY, raw);
      } catch {
        /* ignore */
      }
    }
    if (!raw) return {};
    const p = JSON.parse(raw) as Persist;
    return p && typeof p === 'object' ? p : {};
  } catch {
    return {};
  }
}

function write(p: Persist) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore quota */
  }
}

export function mergeFeedComments(
  feedId: string,
  meta: { title: string; tags: string[]; categoryLabel: string }
): FeedComment[] {
  const seed = buildSeedComments(feedId, meta).map((c) => ({ ...c, source: 'seed' as const }));
  const extra = read()[feedId] ?? [];
  const normalized = extra.map((c) => ({
    ...c,
    source: 'user' as const,
  }));
  return [...seed, ...normalized].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function appendFeedComment(feedId: string, text: string) {
  const t = text.trim();
  if (!t) return;
  const p = read();
  const list = p[feedId] ?? [];
  const row: FeedComment = {
    id: `user-cmt-${crypto.randomUUID()}`,
    author: {
      name: '我',
      avatar: pickPortrait('ql-viewer-avatar', 96),
    },
    text: t,
    createdAt: new Date().toISOString(),
    source: 'user',
  };
  p[feedId] = [...list, row];
  write(p);
}

export function formatCommentTime(iso: string): string {
  const d = new Date(iso);
  const ts = d.getTime();
  if (Number.isNaN(ts)) return '';
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return '刚刚';
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} 小时前`;
  const days = Math.floor(h / 24);
  if (days < 14) return `${days} 天前`;
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}
