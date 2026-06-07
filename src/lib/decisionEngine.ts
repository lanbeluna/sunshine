import { DESTINATIONS } from '@/data/destinations';
import type { Budget, Companion, Destination, Mood, UserDecisionProfile } from '@/types/decision';

const W = { mood: 28, budget: 22, duration: 18, companion: 16, transport: 16 } as const;
const TOTAL = W.mood + W.budget + W.duration + W.companion + W.transport;

function moodScore(user: Mood, moods: Mood[]): number {
  if (moods.includes(user)) return W.mood;
  const related: Record<Mood, Mood[]> = {
    relax: ['photo', 'food'],
    adventure: ['photo'],
    photo: ['relax', 'food'],
    food: ['relax', 'photo'],
  };
  const alt = related[user] ?? [];
  if (alt.some((m) => moods.includes(m))) return W.mood * 0.72;
  return W.mood * 0.45;
}

function budgetOrder(b: Budget): number {
  return { low: 0, medium: 1, high: 2, luxury: 3 }[b];
}

function budgetScore(user: Budget, dest: Budget): number {
  const d = Math.abs(budgetOrder(user) - budgetOrder(dest));
  if (d === 0) return W.budget;
  if (d === 1) return W.budget * 0.78;
  if (d === 2) return W.budget * 0.55;
  return W.budget * 0.38;
}

function durationScore(user: UserDecisionProfile['duration'], dest: UserDecisionProfile['duration']): number {
  if (user === dest) return W.duration;
  const close =
    (user === 'weekend' && dest === 'week') ||
    (user === 'week' && dest === 'weekend') ||
    (user === '1day' && dest === 'weekend') ||
    (user === 'weekend' && dest === '1day');
  if (close) return W.duration * 0.72;
  return W.duration * 0.5;
}

function companionScore(user: UserDecisionProfile['companion'], list: Companion[]): number {
  if (list.includes(user)) return W.companion;
  return W.companion * 0.52;
}

function transportScore(user: UserDecisionProfile['transport'], list: UserDecisionProfile['transport'][]): number {
  if (list.includes(user)) return W.transport;
  if (user === 'bus' && list.includes('train')) return W.transport * 0.85;
  if (user === 'drive' && list.includes('train')) return W.transport * 0.55;
  return W.transport * 0.48;
}

/** 0–100 连续分，供展示与排序 */
export function scoreDestination(profile: UserDecisionProfile, dest: Destination): number {
  const { tags } = dest;
  let raw = 0;
  raw += moodScore(profile.mood, tags.mood);
  raw += budgetScore(profile.budget, tags.budget);
  raw += durationScore(profile.duration, tags.duration);
  raw += companionScore(profile.companion, tags.companion);
  raw += transportScore(profile.transport, tags.transport);
  return Math.round((raw / TOTAL) * 100);
}

export function matchDestination(profile: UserDecisionProfile): { destination: Destination; matchPercent: number } {
  const scored = DESTINATIONS.map((d) => {
    const matchScore = scoreDestination(profile, d);
    return { ...d, matchScore };
  });
  scored.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  const top = scored[0]?.matchScore ?? 0;
  const ties = scored.filter((x) => (x.matchScore ?? 0) === top);
  const pick = ties[Math.floor(Math.random() * ties.length)] ?? scored[0];
  const matchPercent = Math.min(99, Math.max(74, pick.matchScore ?? 88));
  return { destination: pick, matchPercent };
}

export function randomDestination(): Destination {
  const d = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
  return { ...d, matchScore: undefined };
}
