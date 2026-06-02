export type Mood = 'relax' | 'adventure' | 'photo' | 'food';
export type Budget = 'low' | 'medium' | 'high' | 'luxury';
export type Duration = '1day' | 'weekend' | 'week' | 'long';
export type Companion = 'solo' | 'couple' | 'family' | 'friends';
/** 与目的地 tags 对齐；「大巴随便」对应 bus */
export type Transport = 'train' | 'plane' | 'drive' | 'bus';
export type TravelSeason = 'spring' | 'summer' | 'autumn' | 'winter' | 'any';
export type PreferredActivity = 'food' | 'photo' | 'nature' | 'culture' | 'shopping' | 'slow';

export interface UserDecisionProfile {
  mood: Mood;
  budget: Budget;
  duration: Duration;
  companion: Companion;
  transport: Transport;
  season?: TravelSeason;
  activities?: PreferredActivity[];
}

export interface DestinationTags {
  mood: Mood[];
  budget: Budget;
  duration: Duration;
  companion: Companion[];
  transport: Transport[];
}

export interface DestinationBudget {
  min: number;
  max: number;
  currency: string;
}

export interface DestinationItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  tags: DestinationTags;
  images: {
    cover: string;
    food: string;
    scenery: string;
  };
  budget: DestinationBudget;
  bestSeason: string;
  description: string;
  highlights: string[];
  itinerary: DestinationItineraryDay[];
  /** 决策引擎写入的匹配分（0–100） */
  matchScore?: number;
}

export type DecisionPhase = 'idle' | 'qa' | 'loading' | 'result';
