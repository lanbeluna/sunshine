import { appendDraftNote } from '@/lib/notesStore';
import { appendCustomTrip } from '@/lib/tripsStorage';
import { tripFromDestination } from '@/lib/tripFromDestination';
import { toggleDestinationFavorite, isDestinationFavorited } from '@/lib/wanderStorage';
import { pickPortrait } from '@/lib/unsplashPools';
import {
  saveDestinationFavoriteWithFallback,
  saveJournalDraftWithFallback,
  saveTripHistoryWithFallback,
} from '@/services/supabase/travelData';
import type { Destination, UserDecisionProfile } from '@/types/decision';
import type { JournalEntry } from '@/types/domain';

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function durationDays(dest: Destination) {
  return Math.max(1, dest.itinerary.length);
}

function profileLine(profile: UserDecisionProfile | null) {
  if (!profile) return '由 QL轻旅根据轻量偏好生成。';
  const activities = profile.activities?.length ? profile.activities.join(', ') : 'open inspiration';
  return `偏好：${profile.mood} / ${profile.budget} / ${profile.duration} / ${profile.companion} / ${profile.transport} / ${profile.season ?? 'any'} / ${activities}`;
}

export async function saveDestinationInspiration(dest: Destination) {
  if (!isDestinationFavorited(dest.id)) {
    toggleDestinationFavorite(dest.id);
  }
  return saveDestinationFavoriteWithFallback(dest);
}

export async function createItineraryDraft(dest: Destination) {
  const start = addDays(new Date(), 14);
  const end = addDays(start, durationDays(dest) - 1);
  const trip = tripFromDestination(dest, isoDate(start), isoDate(end), `inspiration-${dest.id}-${Date.now()}`);
  appendCustomTrip(trip);
  const result = await saveTripHistoryWithFallback(trip);
  return { trip, sync: result };
}

export async function createJournalDraft(dest: Destination, profile: UserDecisionProfile | null) {
  const body = [
    `${dest.name} 是这次 QL轻旅生成的旅行灵感。`,
    profileLine(profile),
    `推荐理由：${dest.description}`,
    `预算参考：${dest.budget.currency} ${dest.budget.min.toLocaleString()}-${dest.budget.max.toLocaleString()}`,
    `行程草稿：${dest.itinerary.map((day) => `Day${day.day} ${day.title}`).join(' / ')}`,
    '这是一份轻量灵感草稿，不是正式预订方案，可以继续补充真实照片、花费和体验记录。',
  ].join('\n\n');

  const note = {
    id: `draft-${dest.id}-${Date.now()}`,
    title: `${dest.name} 旅行灵感草稿`,
    image: dest.images.cover,
    likes: 0,
    tags: [dest.country, dest.bestSeason, '旅行灵感'],
    authorName: 'QL轻旅',
    authorAvatar: pickPortrait('ql-journal-draft', 128),
    savedAt: new Date().toISOString(),
    body,
  };
  appendDraftNote(note);
  const entry: JournalEntry = {
    id: note.id,
    title: note.title,
    coverImage: note.image,
    tags: note.tags,
    body,
    isDraft: true,
    createdAt: note.savedAt,
    updatedAt: note.savedAt,
    source: 'localStorage',
  };
  const result = await saveJournalDraftWithFallback(entry, profile);
  return { note, sync: result };
}
