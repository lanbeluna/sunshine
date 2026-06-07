import type { PostgrestError } from '@supabase/supabase-js';
import { ensureAnonymousSession } from '@/services/supabase/auth';
import { getSupabase } from '@/services/supabase/client';
import type { Destination, UserDecisionProfile } from '@/types/decision';
import type { JournalEntry, SavedTrip } from '@/types/domain';
import type { Trip } from '@/types/trip';

type ServiceResult<T> =
  | { ok: true; data: T; source: 'supabase' | 'localStorage' }
  | { ok: false; data: T; source: 'localStorage'; error: string };

function errorMessage(error: PostgrestError | Error | null | unknown): string {
  if (!error) return 'Unknown Supabase error.';
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'Supabase request failed.';
}

async function getSession() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const session = await ensureAnonymousSession(supabase);
  if (!session) return null;
  return { supabase, userId: session.userId };
}

export async function saveTripHistoryWithFallback(trip: Trip): Promise<ServiceResult<SavedTrip>> {
  const localTrip: SavedTrip = { ...trip, source: 'localStorage' };

  try {
    const session = await getSession();
    if (!session) return { ok: true, data: localTrip, source: 'localStorage' };

    const { error } = await session.supabase.from('trip_history').insert({
      user_id: session.userId,
      plan_id: trip.id,
      title: trip.destination,
      trip_date: new Date(`${trip.startDate}T00:00:00`).toISOString(),
      completed: trip.status === 'done',
    });

    if (error) {
      return { ok: false, data: localTrip, source: 'localStorage', error: errorMessage(error) };
    }
    return { ok: true, data: { ...trip, source: 'supabase' }, source: 'supabase' };
  } catch (error) {
    return { ok: false, data: localTrip, source: 'localStorage', error: errorMessage(error) };
  }
}

export async function saveJournalDraftWithFallback(
  entry: JournalEntry,
  profile: UserDecisionProfile | null
): Promise<ServiceResult<JournalEntry>> {
  try {
    const session = await getSession();
    if (!session) return { ok: true, data: entry, source: 'localStorage' };

    const { error } = await session.supabase.from('journals').insert({
      id: crypto.randomUUID(),
      user_id: session.userId,
      title: entry.title,
      cover_image: entry.coverImage,
      pages: [
        {
          type: 'draft',
          body: entry.body,
          tags: entry.tags,
          preference: profile,
        },
      ],
      created_at: entry.createdAt,
      updated_at: entry.updatedAt,
    });

    if (error) {
      return { ok: false, data: entry, source: 'localStorage', error: errorMessage(error) };
    }
    return { ok: true, data: { ...entry, source: 'supabase' }, source: 'supabase' };
  } catch (error) {
    return { ok: false, data: entry, source: 'localStorage', error: errorMessage(error) };
  }
}

export async function saveDestinationFavoriteWithFallback(
  destination: Destination
): Promise<ServiceResult<Destination>> {
  try {
    const session = await getSession();
    if (!session) return { ok: true, data: destination, source: 'localStorage' };

    const { error } = await session.supabase.from('user_settings').upsert({
      user_id: session.userId,
      favorite_areas: [destination.id],
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { ok: false, data: destination, source: 'localStorage', error: errorMessage(error) };
    }
    return { ok: true, data: destination, source: 'supabase' };
  } catch (error) {
    return { ok: false, data: destination, source: 'localStorage', error: errorMessage(error) };
  }
}
