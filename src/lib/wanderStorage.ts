import type { FeedItem } from '@/types/feed';
import { syncDestinationCollection, syncGuideCollection } from '@/lib/collectionsStore';

const STORAGE_KEY = 'ql_explore_prefs_v1';
const STORAGE_LEGACY = 'wander-ai-v1';

export type WanderPersist = {
  feedLikes: Record<string, boolean>;
  feedCollected: Record<string, boolean>;
  destinationFavorites: Record<string, boolean>;
};

function defaults(): WanderPersist {
  return { feedLikes: {}, feedCollected: {}, destinationFavorites: {} };
}

function read(): WanderPersist {
  if (typeof window === 'undefined') return defaults();
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) raw = localStorage.getItem(STORAGE_LEGACY);
    if (raw && !localStorage.getItem(STORAGE_KEY) && localStorage.getItem(STORAGE_LEGACY)) {
      try {
        localStorage.setItem(STORAGE_KEY, raw);
      } catch {
        /* ignore */
      }
    }
    if (!raw) return defaults();
    const p = JSON.parse(raw) as Partial<WanderPersist>;
    return {
      feedLikes: { ...defaults().feedLikes, ...p.feedLikes },
      feedCollected: { ...defaults().feedCollected, ...p.feedCollected },
      destinationFavorites: { ...defaults().destinationFavorites, ...p.destinationFavorites },
    };
  } catch {
    return defaults();
  }
}

function write(p: WanderPersist) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore quota */
  }
}

export function isFeedLiked(id: string): boolean {
  return !!read().feedLikes[id];
}

export function isFeedCollected(id: string): boolean {
  return !!read().feedCollected[id];
}

export function toggleFeedLike(id: string): boolean {
  const p = read();
  const next = !p.feedLikes[id];
  p.feedLikes[id] = next;
  write(p);
  return next;
}

export function toggleFeedCollected(id: string): boolean {
  const p = read();
  const next = !p.feedCollected[id];
  p.feedCollected[id] = next;
  write(p);
  syncGuideCollection(id, next);
  return next;
}

export function isDestinationFavorited(id: string): boolean {
  return !!read().destinationFavorites[id];
}

export function toggleDestinationFavorite(id: string): boolean {
  const p = read();
  const next = !p.destinationFavorites[id];
  p.destinationFavorites[id] = next;
  write(p);
  syncDestinationCollection(id, next);
  return next;
}

/** 将目录数据与用户 localStorage 状态合并 */
export function mergeFeedWithStorage(items: FeedItem[]): FeedItem[] {
  return items.map((it) => ({
    ...it,
    isLiked: isFeedLiked(it.id),
    isCollected: isFeedCollected(it.id),
  }));
}
