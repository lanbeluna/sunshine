/** 个人中心「我的收藏」数据源，与探索/决策收藏操作同步 */
import { readLocalJson, writeLocalJson } from '@/services/localStorageFallback';

const KEY = 'ql_collections';
const KEY_LEGACY = 'wanderai_collections';
const LEGACY_WANDER = 'wander-ai-v1';

export type CollectionDestination = { id: string; savedAt: string };
export type CollectionGuide = { id: string; savedAt: string };

export type CollectionsData = {
  version: 1;
  migrated?: boolean;
  destinations: CollectionDestination[];
  guides: CollectionGuide[];
};

function empty(): CollectionsData {
  return { version: 1, migrated: false, destinations: [], guides: [] };
}

function readLegacyWander(): { destinationFavorites: Record<string, boolean>; feedCollected: Record<string, boolean> } {
  try {
    const raw = localStorage.getItem(LEGACY_WANDER);
    if (!raw) return { destinationFavorites: {}, feedCollected: {} };
    const p = JSON.parse(raw) as {
      destinationFavorites?: Record<string, boolean>;
      feedCollected?: Record<string, boolean>;
    };
    return {
      destinationFavorites: p.destinationFavorites ?? {},
      feedCollected: p.feedCollected ?? {},
    };
  } catch {
    return { destinationFavorites: {}, feedCollected: {} };
  }
}

function migrateIfNeeded(data: CollectionsData): CollectionsData {
  if (data.migrated) return data;
  const leg = readLegacyWander();
  const at = new Date().toISOString();
  const destSet = new Set(data.destinations.map((d) => d.id));
  Object.entries(leg.destinationFavorites).forEach(([id, on]) => {
    if (on && !destSet.has(id)) {
      data.destinations.push({ id, savedAt: at });
      destSet.add(id);
    }
  });
  const guideSet = new Set(data.guides.map((g) => g.id));
  Object.entries(leg.feedCollected).forEach(([id, on]) => {
    if (on && !guideSet.has(id)) {
      data.guides.push({ id, savedAt: at });
      guideSet.add(id);
    }
  });
  data.destinations.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  data.guides.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  data.migrated = true;
  return data;
}

export function loadCollections(): CollectionsData {
  if (typeof window === 'undefined') return empty();
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
    if (!raw) {
      const d = empty();
      const migrated = migrateIfNeeded(d);
      saveCollections(migrated);
      return migrated;
    }
    const parsed = {
      ...empty(),
      ...readLocalJson<Partial<CollectionsData>>(raw === localStorage.getItem(KEY) ? KEY : KEY_LEGACY, {}).data,
    };
    if (!parsed.version) {
      const d = empty();
      const migrated = migrateIfNeeded(d);
      saveCollections(migrated);
      return migrated;
    }
    parsed.destinations = parsed.destinations ?? [];
    parsed.guides = parsed.guides ?? [];
    const migrated = migrateIfNeeded(parsed);
    if (migrated !== parsed) saveCollections(migrated);
    return migrated;
  } catch {
    const d = empty();
    const migrated = migrateIfNeeded(d);
    saveCollections(migrated);
    return migrated;
  }
}

export function saveCollections(data: CollectionsData) {
  writeLocalJson(KEY, data);
}

export function syncDestinationCollection(id: string, collected: boolean) {
  const d = loadCollections();
  if (collected) {
    if (!d.destinations.some((x) => x.id === id)) {
      d.destinations.unshift({ id, savedAt: new Date().toISOString() });
    }
  } else {
    d.destinations = d.destinations.filter((x) => x.id !== id);
  }
  saveCollections(d);
}

export function syncGuideCollection(id: string, collected: boolean) {
  const d = loadCollections();
  if (collected) {
    if (!d.guides.some((x) => x.id === id)) {
      d.guides.unshift({ id, savedAt: new Date().toISOString() });
    }
  } else {
    d.guides = d.guides.filter((x) => x.id !== id);
  }
  saveCollections(d);
}
