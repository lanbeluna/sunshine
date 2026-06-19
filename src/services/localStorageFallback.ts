export type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; data: T; error: string };

export function readLocalJson<T>(key: string, fallback: T): StorageResult<T> {
  if (typeof window === 'undefined') return { ok: true, data: fallback };

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return { ok: true, data: fallback };
    return { ok: true, data: JSON.parse(raw) as T };
  } catch (error) {
    return {
      ok: false,
      data: fallback,
      error: error instanceof Error ? error.message : 'Unable to read local data.',
    };
  }
}

export function writeLocalJson<T>(key: string, value: T): StorageResult<T> {
  if (typeof window === 'undefined') return { ok: true, data: value };

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true, data: value };
  } catch (error) {
    return {
      ok: false,
      data: value,
      error: error instanceof Error ? error.message : 'Unable to save local data.',
    };
  }
}
