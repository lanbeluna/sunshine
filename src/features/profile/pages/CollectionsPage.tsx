import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Compass, HeartOff } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Tag } from '@/components/common/Tag';
import { WanderImage } from '@/components/media/WanderImage';
import { FeedCard } from '@/features/explore/components/FeedCard';
import { ProfileSubPageLayout } from '@/features/profile/components/ProfileSubPageLayout';
import { FEED_CATALOG } from '@/data/feedCatalog';
import { getDestinationById } from '@/data/destinations';
import { loadCollections } from '@/lib/collectionsStore';
import { toggleDestinationFavorite, toggleFeedCollected } from '@/lib/wanderStorage';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

type Tab = 'all' | 'destination' | 'guide';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'destination', label: '目的地' },
  { id: 'guide', label: '灵感笔记' },
];

export default function CollectionsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('all');
  const [bump, setBump] = useState(0);

  const { destinations, guides } = useMemo(() => {
    void bump;
    const collections = loadCollections();
    return { destinations: collections.destinations, guides: collections.guides };
  }, [bump]);

  const destCards = useMemo(
    () =>
      destinations
        .map((item) => getDestinationById(item.id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [destinations]
  );

  const guideItems = useMemo(
    () =>
      guides
        .map((guide) => {
          const row = FEED_CATALOG.find((item) => item.id === guide.id);
          return row ? { ...row, isCollected: true } : null;
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [guides]
  );

  const showDest = tab === 'all' || tab === 'destination';
  const showGuide = tab === 'all' || tab === 'guide';
  const empty =
    (tab === 'all' && destCards.length === 0 && guideItems.length === 0) ||
    (tab === 'destination' && destCards.length === 0) ||
    (tab === 'guide' && guideItems.length === 0);

  const unfavoriteDest = (id: string) => {
    toggleDestinationFavorite(id);
    setBump((value) => value + 1);
    toast.message('已移出收藏');
  };

  const uncollectGuide = (id: string) => {
    toggleFeedCollected(id);
    setBump((value) => value + 1);
    toast.message('已移出收藏');
  };

  return (
    <ProfileSubPageLayout title="保存的旅行灵感">
      <div className="sticky top-0 z-10 border-b border-[var(--ql-card-border)] bg-[var(--ql-bg)]/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {TABS.map((item) => {
            const on = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  'ql-focus shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors active:scale-[0.98]',
                  on ? 'bg-[var(--ql-accent)] text-white' : 'bg-[var(--ql-soft)] text-[var(--ql-muted)]'
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 px-4 pb-24 pt-4">
        {empty ? (
          <EmptyState
            icon={<Bookmark className="h-6 w-6 text-[var(--ql-accent)]" />}
            title="还没有保存任何灵感"
            description="先去生成一个目的地推荐，再把喜欢的目的地、攻略或草稿存到这里。"
            actionLabel="开始生成"
            onAction={() => navigate('/decision')}
          />
        ) : (
          <>
            {showDest && destCards.length > 0 ? (
              <section className="space-y-3">
                {destCards.map((destination) => (
                  <Card key={destination.id} padded={false} className="overflow-hidden">
                    <Link to={`/destination/${destination.id}`} className="block">
                      <div className="relative aspect-[16/10] w-full">
                        <WanderImage
                          src={destination.images.cover}
                          alt={destination.name}
                          fallbackLabel={destination.name}
                          className="h-full w-full"
                          width={800}
                          height={500}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <Tag className="border-white/20 bg-white/20 text-white">
                            <Compass className="h-3 w-3" />
                            目的地灵感
                          </Tag>
                          <h3 className="mt-2 text-lg font-black text-white">{destination.name}</h3>
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between gap-3 p-3">
                      <p className="line-clamp-1 text-xs text-[var(--ql-muted)]">{destination.bestSeason}</p>
                      <button
                        type="button"
                        onClick={() => unfavoriteDest(destination.id)}
                        className="ql-focus inline-flex items-center gap-1 rounded-full border border-rose-400/30 px-3 py-1.5 text-xs font-bold text-rose-300 transition-colors active:bg-rose-500/10"
                      >
                        <HeartOff className="h-3.5 w-3.5" />
                        取消
                      </button>
                    </div>
                  </Card>
                ))}
              </section>
            ) : null}

            {showGuide && guideItems.length > 0 ? (
              <section className="columns-2 gap-3 [column-fill:_balance]">
                {guideItems.map((feed, index) => (
                  <div key={feed.id} className="mb-3 break-inside-avoid">
                    <FeedCard
                      item={feed}
                      index={index}
                      onLike={() => toast.message('可在探索页继续互动')}
                      onCollect={() => uncollectGuide(feed.id)}
                      onOpen={() => toast.info(feed.title)}
                    />
                  </div>
                ))}
              </section>
            ) : null}
          </>
        )}
      </div>
    </ProfileSubPageLayout>
  );
}
