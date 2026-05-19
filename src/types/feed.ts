export type FeedCategoryId =
  | 'all'
  | 'domestic'
  | 'international'
  | 'blitz'
  | 'slow'
  | 'food'
  | 'bnb'
  | 'pitfall'
  | 'budget'
  | 'family';

export type FeedItemType = 'guide' | 'destination' | 'video' | 'topic';

export interface FeedAuthor {
  name: string;
  avatar: string;
}

/** 贴文评论（探索页种子评论 + 用户本地追加） */
export interface FeedComment {
  id: string;
  author: FeedAuthor;
  text: string;
  createdAt: string;
  /** 种子数据仅内存合并；用户评论持久化到 localStorage */
  source?: 'seed' | 'user';
}

export interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  author: FeedAuthor;
  image: string;
  likes: number;
  isLiked: boolean;
  isCollected: boolean;
  tags: string[];
  /** 展示用分类文案，如「国内游」 */
  category: string;
  /** 与分类 Tab 对齐 */
  categoryId: FeedCategoryId;
  /** 贴文正文（多段以空行分隔） */
  body: string;
}
