import { motion } from 'framer-motion';
import { BookOpen, Calendar, CloudSun, Heart, MapPlus, Plane, Wallet } from 'lucide-react';
import { WanderImage } from '@/components/media/WanderImage';
import type { Destination } from '@/types/decision';
import { itineraryDayImageUrl } from '@/data/destinationImages';
import { formatTransportList } from '@/lib/transportLabels';
import { cn } from '@/lib/utils';

type Props = {
  destination: Destination;
  matchPercent: number;
  favorited: boolean;
  onReset: () => void;
  onToggleFavorite: () => void;
  onViewItinerary: () => void;
  onSaveItineraryDraft: () => void;
  onSaveJournalDraft: () => void;
};

export function ResultView({
  destination,
  matchPercent,
  favorited,
  onReset,
  onToggleFavorite,
  onViewItinerary,
  onSaveItineraryDraft,
  onSaveJournalDraft,
}: Props) {
  const pct = destination.matchScore ?? matchPercent;
  const nights = Math.max(1, destination.itinerary.length - 1);
  const budgetLine = `${destination.budget.currency} ${destination.budget.min.toLocaleString()}–${destination.budget.max.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="pb-6"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <WanderImage
          src={destination.images.cover}
          alt={destination.name}
          fallbackLabel={destination.name}
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full"
          width={960}
          height={600}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wander-bg via-wander-bg/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-12">
          <p className="text-xs font-medium uppercase tracking-wider text-indigo-200/90">{destination.country}</p>
          <h2 className="text-3xl font-bold tracking-tight text-white">{destination.name}</h2>
        </div>
        <div className="absolute right-3 top-3 flex h-16 w-16 flex-col items-center justify-center rounded-full border border-white/20 bg-black/50 text-center backdrop-blur-md">
          <span className="text-lg font-bold leading-none text-white">{pct}%</span>
          <span className="text-[9px] font-medium text-indigo-200">匹配</span>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        <p className="text-sm leading-relaxed text-wander-secondary">{destination.description}</p>

        <div className="flex flex-wrap gap-2">
          {destination.highlights.map((h) => (
            <span
              key={h}
              className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-200"
            >
              {h}
            </span>
          ))}
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-wander-muted">目的地图集</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="aspect-[4/3] w-full">
                <WanderImage
                  src={destination.images.cover}
                  alt={`${destination.name}封面`}
                  fallbackLabel={destination.name}
                  className="h-full w-full"
                  width={320}
                  height={240}
                />
              </div>
              <p className="bg-wander-surface py-1 text-center text-[10px] font-medium text-wander-secondary">封面</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="aspect-[4/3] w-full">
                <WanderImage
                  src={destination.images.food}
                  alt={`${destination.name}美食`}
                  fallbackLabel={`${destination.name} · 美食`}
                  className="h-full w-full"
                  width={320}
                  height={240}
                />
              </div>
              <p className="bg-wander-surface py-1 text-center text-[10px] font-medium text-wander-secondary">美食</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="aspect-[4/3] w-full">
                <WanderImage
                  src={destination.images.scenery}
                  alt={`${destination.name}风景`}
                  fallbackLabel={`${destination.name} · 风景`}
                  className="h-full w-full"
                  width={320}
                  height={240}
                />
              </div>
              <p className="bg-wander-surface py-1 text-center text-[10px] font-medium text-wander-secondary">风景</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-wander-card p-3">
            <Wallet className="mb-2 h-5 w-5 text-amber-400" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-wander-muted">参考预算</p>
            <p className="text-sm font-bold leading-snug text-white">{budgetLine}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-wander-card p-3">
            <Calendar className="mb-2 h-5 w-5 text-sky-400" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-wander-muted">建议行程</p>
            <p className="text-lg font-bold text-white">
              {destination.itinerary.length}天{nights}晚
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-wander-card p-3">
            <CloudSun className="mb-2 h-5 w-5 text-orange-300" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-wander-muted">最佳季节</p>
            <p className="text-sm font-bold leading-snug text-white">{destination.bestSeason}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-wander-card p-3">
            <Plane className="mb-2 h-5 w-5 text-indigo-300" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-wander-muted">适配交通</p>
            <p className="text-sm font-bold leading-snug text-white">{formatTransportList(destination.tags.transport)}</p>
          </div>
        </div>

        <div id="wander-itinerary">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-wander-muted">行程速览</h3>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {destination.itinerary.map((d) => (
              <div
                key={d.day}
                className="w-[72%] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-wander-surface sm:w-[56%]"
              >
                <div className="relative aspect-[16/10] w-full">
                  <WanderImage
                    src={itineraryDayImageUrl(destination.images, d.day - 1)}
                    alt={d.title}
                    fallbackLabel={`${destination.name} · ${d.title}`}
                    className="absolute inset-0 h-full w-full"
                    width={320}
                    height={200}
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                    Day{d.day}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-medium text-white">{d.title}</p>
                  <ul className="mt-1.5 space-y-0.5 text-[11px] leading-relaxed text-wander-secondary">
                    {d.activities.map((a) => (
                      <li key={a} className="flex gap-1">
                        <span className="text-indigo-400">·</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={onViewItinerary}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold text-white shadow-lg shadow-indigo-500/25 transition active:scale-[0.98]"
          >
            查看详细行程
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onSaveItineraryDraft}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-500/12 px-3 text-sm font-semibold text-sky-100 transition active:scale-[0.98]"
            >
              <MapPlus className="h-4 w-4" />
              生成行程草稿
            </button>
            <button
              type="button"
              onClick={onSaveJournalDraft}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-amber-400/12 px-3 text-sm font-semibold text-amber-100 transition active:scale-[0.98]"
            >
              <BookOpen className="h-4 w-4" />
              写入手记草稿
            </button>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onReset}
              className="h-12 flex-1 rounded-xl border border-white/15 bg-wander-surface font-semibold text-wander-secondary transition active:scale-[0.98] active:bg-white/5"
            >
              重新决策
            </button>
            <motion.button
              type="button"
              onClick={onToggleFavorite}
              whileTap={{ scale: 0.92 }}
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-wander-surface transition',
                favorited && 'border-rose-500/40 bg-rose-500/15 text-rose-400'
              )}
              aria-label={favorited ? '已收藏' : '收藏目的地'}
            >
              <motion.div key={favorited ? 'on' : 'off'} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
                <Heart className={cn('h-6 w-6', favorited && 'fill-current')} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
