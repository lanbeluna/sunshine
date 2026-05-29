import type { FeedItem } from '@/types/feed';
import { FeedCard } from './FeedCard';

type Props = {
  items: FeedItem[];
  onToggleLike: (id: string) => void;
  onToggleCollect: (id: string) => void;
  onOpenItem: (item: FeedItem) => void;
};

export function MasonryGrid({ items, onToggleLike, onToggleCollect, onOpenItem }: Props) {
  return (
    <div className="px-4 pt-3">
      <div className="grid grid-cols-2 items-start gap-3">
        {items.map((item, index) => (
          <FeedCard
            key={item.id}
            item={item}
            index={index}
            onLike={onToggleLike}
            onCollect={onToggleCollect}
            onOpen={onOpenItem}
          />
        ))}
      </div>
    </div>
  );
}
