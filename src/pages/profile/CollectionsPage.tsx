import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from '@/lib/toast';
import { FeedCard } from '@/components/explore/FeedCard';
import { ProfileSubPageLayout } from '@/components/profile/ProfileSubPageLayout';
import { WanderImage } from '@/components/media/WanderImage';
import { FEED_CATALOG } from '@/data/feedCatalog';
import { getDestinationById } from '@/data/destinations';
import { loadCollections } from '@/lib/collectionsStore';
import { toggleDestinationFavorite, toggleFeedCollected } from '@/lib/wanderStorage';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

type Tab = 'all' | 'destination' | 'guide';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'destination', label: '目的地' },
  { id: 'guide', label: '攻略笔记' },
];

export default function CollectionsPage() {
  const location = useLocation();
  const { theme } = useAppContext();
  const light = theme === 'light';
  const [tab, setTab] = useState<Tab>('all');
  const [bump, setBump] = useState(0);

  const { destinations, guides } = useMemo(() => {
    void bump;
    const c = loadCollections();
    return { destinations: c.destinations, guides: c.guides };
  }, [location.key, bump]);

  const destCards = useMemo(
    () =>
      destinations
        .map((x) => getDestinationById(x.id))
        .filter((d): d is NonNullable<typeof d> => Boolean(d)),
    [destinations]
  );

  const guideItems = useMemo(() => {
    return guides
      .map((g) => {
        const row = FEED_CATALOG.find((f) => f.id === g.id);
        if (!row) return null;
        return { ...row, isCollected: true };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [guides]);

  const empty =
    (tab === 'all' && destCards.length === 0 && guideItems.length === 0) ||
    (tab === 'destination' && destCards.length === 0) ||
    (tab === 'guide' && guideItems.length === 0);

  const showDest = tab === 'all' || tab === 'destination';
  const showGuide = tab === 'all' || tab === 'guide';

  const unfavoriteDest = (id: string) => {
    toggleDestinationFavorite(id);
    setBump((b) => b + 1);
    toast.message('已取消收藏');
  };

  const uncollectGuide = (id: string) => {
    toggleFeedCollected(id);
    setBump((b) => b + 1);
    toast.message('已取消收藏');
  };

  return (
    <ProfileSubPageLayout title="我的收藏">
      <div
        className={cn(
          'sticky top-0 z-10 border-b px-2 py-2 backdrop-blur-md',
          light ? 'border-zinc-200 bg-white/95' : 'border-white/10 bg-wander-bg/95'
        )}
      >
        <div className="flex gap-2 overflow-x-auto px-2 pb-1 scrollbar-none">
          {TABS.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
                  on
                    ? 'bg-indigo-500 text-white shadow-md'
                    : light
                      ? 'bg-zinc-100 text-zinc-600'
                      : 'bg-white/10 text-wander-secondary'
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 px-4 pb-24 pt-4">
        {empty ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <WanderImage
              src=""
              alt=""
              fallbackLabel="收藏"
              className="mb-5 h-36 w-full max-w-[280px] overflow-hidden rounded-2xl shadow-lg shadow-black/20"
              width={560}
              height={288}
            />
            <p className={cn('text-sm', light ? 'text-zinc-600' : 'text-wander-secondary')}>还没有收藏任何内容，去发现和收藏吧</p>
            <Link
              to="/explore"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
            >
              去探索
            </Link>
          </div>
        ) : (
          <>
            {showDest && destCards.length > 0 ? (
              <section className="space-y-3">
                {tab === 'all' && guideItems.length > 0 ? (
                  <p className={cn('text-xs font-semibold uppercase tracking-wider', light ? 'text-zinc-500' : 'text-wander-muted')}>
                    目的地
                  </p>
                ) : null}
                {destCards.map((d) => (
                  <div
                    key={d.id}
                    className={cn(
                      'overflow-hidden rounded-2xl border',
                      light ? 'border-zinc-200 bg-white' : 'border-white/10 bg-wander-card'
                    )}
                  >
                    <Link to={`/destination/${d.id}`} className="block">
                      <div className="relative aspect-[16/10] w-full">
                        <WanderImage
                          src={d.images.cover}
                          alt={d.name}
                          fallbackLabel={d.name}
                          className="h-full w-full"
                          width={800}
                          height={500}
                        />
                      </div>
                    </Link>
                    <div className="flex items-center justify-between gap-2 px-3 py-3">
                      <Link
                        to={`/destination/${d.id}`}
                        className={cn('min-w-0 flex-1 font-semibold', light ? 'text-zinc-900' : 'text-white')}
                      >
                        {d.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => unfavoriteDest(d.id)}
                        className="shrink-0 rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-400 transition active:bg-rose-500/10"
                      >
                        取消收藏
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            ) : null}

            {showGuide && guideItems.length > 0 ? (
              <section className="space-y-3">
                {tab === 'all' && destCards.length > 0 ? (
                  <p className={cn('pt-2 text-xs font-semibold uppercase tracking-wider', light ? 'text-zinc-500' : 'text-wander-muted')}>
                    攻略笔记
                  </p>
                ) : null}
                <div className="columns-2 gap-3 [column-fill:_balance]">
                  {guideItems.map((feed, index) => (
                    <div key={feed.id} className="mb-3 break-inside-avoid">
                      <FeedCard
                        item={feed}
                        index={index}
                        onLike={() => toast.message('在探索页可点赞')}
                        onCollect={() => uncollectGuide(feed.id)}
                        onOpen={() => toast.info(feed.title, { description: '完整正文可在探索流后续版本中打开。' })}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </ProfileSubPageLayout>
  );
}
