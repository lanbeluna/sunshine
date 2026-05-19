export interface JournalPage {
  id: string;
  template: 'polaroid' | 'stamp' | 'postcard' | 'ticket';
  imageUrl?: string;
  caption: string;
  date: string;
  location?: string;
  weather?: string;
  stickers: string[];
}

export interface Journal {
  id: string;
  title: string;
  coverImage?: string;
  pages: JournalPage[];
  createdAt: string;
  updatedAt: string;
}

export type PageTemplate = 'polaroid' | 'stamp' | 'postcard' | 'ticket';

export type StickerType =
  | 'sun'
  | 'cloud'
  | 'rain'
  | 'mapPin'
  | 'plane'
  | 'train'
  | 'heart'
  | 'star'
  | 'camera'
  | 'coffee';
