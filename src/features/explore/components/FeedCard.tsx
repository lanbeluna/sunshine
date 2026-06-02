import { motion } from 'framer-motion';
import { Bookmark, Heart, Play } from 'lucide-react';
import { memo } from 'react';
import { WanderImage } from '@/components/media/WanderImage';
import type { FeedItem } from '@/types/feed';
import { formatLikes } from '@/lib/formatLikes';
import { cn } from '@/lib/utils';

type Props = {
  item: FeedItem;
  index: number;
  onLike: (id: string) => void;
  onCollect: (id: string) => void;
  onOpen: (item: FeedItem) => void;
};

const ASPECT = ['4/5', '3/4', '5/6', '2/3'] as const;

function FeedCardComponent({ item, index, onLike, onCollect, onOpen }: Props) {
  const ar = ASPECT[index % ASPECT.length];

  return (
    <motion.article
      layout
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(item);
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(item)}
      className="group break-inside-avoid cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-[#17171A] text-left shadow-ql-photo transition-transform duration-300 [content-visibility:auto] [contain-intrinsic-size:260px] hover:scale-[1.015]"
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="w-full" style={{ aspectRatio: ar }}>
          <WanderImage
            src={item.image}
            alt={item.title}
            fallbackLabel={item.title}
            className="h-full w-full"
            width={400}
            height={520}
            loading={index < 4 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
        </div>
        <span className="pointer-events-none absolute left-2 top-2 rounded-full border border-white/20 bg-black/45 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md">
          {item.category}
        </span>
        <div className="absolute right-2 top-2 flex gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLike(item.id);
            }}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition active:scale-90',
              item.isLiked ? 'bg-wander-coral/90 shadow-wander-glow' : 'bg-black/45'
            )}
            aria-label={item.isLiked ? '取消点赞' : '点赞'}
          >
            <Heart className={cn('h-[18px] w-[18px]', item.isLiked && 'fill-current')} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCollect(item.id);
            }}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition active:scale-90',
              item.isCollected ? 'bg-amber-500/90' : 'bg-black/45'
            )}
            aria-label={item.isCollected ? '取消收藏' : '收藏'}
          >
            <Bookmark className={cn('h-[18px] w-[18px]', item.isCollected && 'fill-current')} />
          </button>
        </div>
        {item.type === 'video' && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-wander-bg shadow-lg">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
          </div>
        )}
      </div>
      <div className="p-3 pt-2.5">
        {item.type === 'topic' ? (
          <p className="text-sm font-semibold text-wander-coral">#{item.title.slice(0, 18)}</p>
        ) : (
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">{item.title}</h3>
        )}
        {item.tags.length > 0 ? (
          <p className="mt-1 line-clamp-1 text-[10px] font-medium text-white/40">{item.tags.join(' · ')}</p>
        ) : null}
        <div className="mt-2 flex items-center justify-between gap-2 text-wander-muted">
          <div className="flex min-w-0 items-center gap-1.5">
            <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
              <WanderImage
                src={item.author.avatar}
                alt={item.author.name}
                fallbackLabel={item.author.name}
                className="h-full w-full"
                width={48}
                height={48}
              />
            </div>
            <span className="truncate text-xs text-wander-secondary">{item.author.name}</span>
          </div>
          <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-wander-coral">
            <Heart className="h-3 w-3" />
            {formatLikes(item.likes + (item.isLiked ? 1 : 0))}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export const FeedCard = memo(FeedCardComponent);
