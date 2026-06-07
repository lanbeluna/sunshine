import type { Budget, Companion, Destination, Duration, PreferredActivity, TravelSeason, Transport } from '@/types/decision';
import type { Trip, TripItineraryDay, TripStatus } from '@/types/trip';

export type ISODateString = string;
export type ISODateTimeString = string;
export type EntityId = string;

export type DemoDataSource = 'supabase' | 'localStorage';

export interface AppUser {
  id: EntityId;
  displayName: string;
  avatarUrl?: string;
  isAnonymous: boolean;
  createdAt?: ISODateTimeString;
}

export interface FavoriteItem {
  id: EntityId;
  targetId: EntityId;
  targetType: 'destination' | 'guide' | 'journal' | 'trip';
  title?: string;
  imageUrl?: string;
  savedAt: ISODateTimeString;
  source: DemoDataSource;
}

export interface JournalEntry {
  id: EntityId;
  title: string;
  coverImage: string;
  tags: string[];
  body: string;
  isDraft: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
  source: DemoDataSource;
}

export interface ItineraryDraft {
  id: EntityId;
  destinationId?: EntityId;
  destination: string;
  imageUrl: string;
  startDate: ISODateString;
  endDate: ISODateString;
  status: TripStatus;
  days: TripItineraryDay[];
  source: DemoDataSource;
}

export interface TravelPreferenceInput {
  budget?: Budget;
  duration?: Duration;
  companion?: Companion;
  transport?: Transport;
  season?: TravelSeason;
  activities?: PreferredActivity[];
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export type DestinationSummary = Pick<
  Destination,
  'id' | 'name' | 'country' | 'description' | 'bestSeason' | 'images'
>;

export type SavedTrip = Trip & {
  source?: DemoDataSource;
};
