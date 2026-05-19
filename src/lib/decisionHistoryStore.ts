const KEY = 'ql_decision_history';
const KEY_LEGACY = 'wanderai_decision_history';

export type DecisionHistoryItem = {
  destinationId: string;
  matchPercent: number;
  at: string;
};

type Persist = { items: DecisionHistoryItem[] };

export function loadDecisionHistory(): DecisionHistoryItem[] {
  if (typeof window === 'undefined') return [];
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
    if (!raw) return [];
    const p = JSON.parse(raw) as Persist;
    return Array.isArray(p.items) ? p.items : [];
  } catch {
    return [];
  }
}

function save(items: DecisionHistoryItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ items: items.slice(0, 200) }));
  } catch {
    /* ignore */
  }
}

export function appendDecisionHistoryRecord(entry: DecisionHistoryItem) {
  const items = loadDecisionHistory();
  const dedupeWindowMs = 2500;
  const last = items[0];
  const t = new Date(entry.at).getTime();
  if (
    last &&
    last.destinationId === entry.destinationId &&
    last.matchPercent === entry.matchPercent &&
    t - new Date(last.at).getTime() < dedupeWindowMs
  ) {
    return;
  }
  items.unshift(entry);
  save(items);
}
