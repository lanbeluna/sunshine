import type { Destination } from '@/types/decision';
import type { Trip, TripItineraryDay } from '@/types/trip';

export function tripFromDestination(dest: Destination, startDate: string, endDate: string, id: string): Trip {
  const itinerary: TripItineraryDay[] = dest.itinerary.map((d) => ({
    day: d.day,
    title: d.title,
    summary: d.activities[0] ?? d.title,
    items: [...d.activities],
  }));

  return {
    id,
    destination: `${dest.name} · ${dest.country}`,
    imageUrl: dest.images.cover,
    startDate,
    endDate,
    status: 'planned',
    companionAvatars: [],
    itinerary,
  };
}
