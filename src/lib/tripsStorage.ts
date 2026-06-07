import type { Trip } from '@/types/trip';
import { readLocalJson, writeLocalJson } from '@/services/localStorageFallback';

const KEY = 'ql_custom_trips_v1';
const KEY_LEGACY = 'wander-custom-trips-v1';

export function loadCustomTrips(): Trip[] {
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
    return readLocalJson<Trip[]>(raw === localStorage.getItem(KEY) ? KEY : KEY_LEGACY, []).data;
  } catch {
    return [];
  }
}

export function saveCustomTrips(trips: Trip[]) {
  writeLocalJson(KEY, trips);
}

export function appendCustomTrip(trip: Trip) {
  const next = [trip, ...loadCustomTrips()];
  saveCustomTrips(next);
}

export function removeCustomTrip(id: string) {
  const next = loadCustomTrips().filter((t) => t.id !== id);
  saveCustomTrips(next);
}
