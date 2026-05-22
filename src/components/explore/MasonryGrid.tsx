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
      <div className="columns-2 gap-3 [column-fill:_balance]">
        {items.map((item, index) => (
          <FeedCard
            key={item.id}
            item={item}
            index={index}
            onLike={() => onToggleLike(item.id)}
            onCollect={() => onToggleCollect(item.id)}
            onOpen={() => onOpenItem(item)}
          />
        ))}
      </div>
    </div>
  );
}
