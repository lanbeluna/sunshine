/** 计划中 / 进行中 / 已完成 */
export type TripStatus = 'planned' | 'ongoing' | 'done';

export interface TripItineraryDay {
  day: number;
  title: string;
  /** 当日概要一句 */
  summary: string;
  /** 详细要点 */
  items: string[];
}

export interface Trip {
  id: string;
  destination: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  /** 同行人头像 URL，用于重叠展示 */
  companionAvatars: string[];
  /** 每日行程（详情页） */
  itinerary: TripItineraryDay[];
}
