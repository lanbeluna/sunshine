import type { UserDecisionProfile } from '@/types/decision';

export type QuickPreset = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  /** Tailwind gradient 类（深色底） */
  gradientClass: string;
  profile: UserDecisionProfile;
};

export const DECISION_QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'heal-weekend',
    emoji: '🌿',
    title: '周末治愈',
    subtitle: '2天1晚·近郊',
    gradientClass: 'bg-gradient-to-br from-emerald-950/95 via-teal-950/90 to-slate-950',
    profile: {
      mood: 'relax',
      budget: 'medium',
      duration: 'weekend',
      companion: 'couple',
      transport: 'train',
    },
  },
  {
    id: 'food-city',
    emoji: '🍜',
    title: '美食之旅',
    subtitle: '吃遍一座城',
    gradientClass: 'bg-gradient-to-br from-orange-950/95 via-amber-950/90 to-stone-950',
    profile: {
      mood: 'food',
      budget: 'medium',
      duration: 'weekend',
      companion: 'friends',
      transport: 'train',
    },
  },
  {
    id: 'photo-spot',
    emoji: '📸',
    title: '出片圣地',
    subtitle: '朋友圈C位',
    gradientClass: 'bg-gradient-to-br from-fuchsia-950/95 via-purple-950/90 to-slate-950',
    profile: {
      mood: 'photo',
      budget: 'medium',
      duration: 'weekend',
      companion: 'couple',
      transport: 'train',
    },
  },
  {
    id: 'hike-escape',
    emoji: '🏔️',
    title: '山野徒步',
    subtitle: '逃离城市',
    gradientClass: 'bg-gradient-to-br from-slate-800/95 via-emerald-950/90 to-zinc-950',
    profile: {
      mood: 'adventure',
      budget: 'medium',
      duration: 'weekend',
      companion: 'friends',
      transport: 'drive',
    },
  },
  {
    id: 'island-sun',
    emoji: '🏖️',
    title: '海岛度假',
    subtitle: '阳光沙滩',
    gradientClass: 'bg-gradient-to-br from-sky-950/95 via-indigo-950/90 to-slate-950',
    profile: {
      mood: 'relax',
      budget: 'high',
      duration: 'week',
      companion: 'couple',
      transport: 'plane',
    },
  },
];
