import {
  PolaroidTemplate,
  PostcardTemplate,
  StampTemplate,
  TicketTemplate,
} from '@/components/templates';
import type { JournalPage } from '@/types';

export function JournalPageCanvas({ page }: { page: JournalPage }) {
  const common = {
    imageUrl: page.imageUrl,
    caption: page.caption || '（空白）',
    date: page.date,
    location: page.location,
  };

  switch (page.template) {
    case 'polaroid':
      return (
        <PolaroidTemplate
          {...common}
          stickers={page.stickers}
          weather={page.weather}
        />
      );
    case 'stamp':
      return <StampTemplate {...common} />;
    case 'postcard':
      return <PostcardTemplate {...common} />;
    case 'ticket':
      return <TicketTemplate {...common} />;
    default:
      return (
        <PolaroidTemplate
          {...common}
          stickers={page.stickers}
          weather={page.weather}
        />
      );
  }
}
