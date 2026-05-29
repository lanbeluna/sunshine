import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { WanderImage } from '@/components/media/WanderImage';
import { formatTripDateRange } from '@/lib/formatTripDate';
import { cn } from '@/lib/utils';
import type { Trip, TripStatus } from '@/types/trip';

const STATUS_LABEL: Record<TripStatus, string> = {
  planned: '计划中',
  ongoing: '进行中',
  done: '已完成',
};

const STATUS_STYLE: Record<TripStatus, string> = {
  planned: 'bg-amber-500/20 text-amber-300 border-amber-500/35',
  ongoing: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35',
  done: 'bg-zinc-600/40 text-zinc-400 border-zinc-500/30',
};

type Props = {
  trip: Trip;
  index: number;
  onOpen: () => void;
};

export function TripCard({ trip, index, onOpen }: Props) {
  const extra = trip.companionAvatars.length > 3 ? trip.companionAvatars.length - 3 : 0;
  const shown = trip.companionAvatars.slice(0, 3);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.28 }}
      whileTap={{ scale: 0.99 }}
      onClick={onOpen}
      className="ql-focus flex min-h-[116px] w-full cursor-pointer items-stretch gap-3 rounded-2xl border border-white/[0.08] bg-[#17171A] p-3 text-left shadow-ql-card transition-colors hover:border-white/15 active:bg-white/[0.04]"
    >
      <div className="relative h-[5.25rem] w-[5.25rem] shrink-0 overflow-hidden rounded-2xl bg-wander-surface ql-photo-shadow">
        <WanderImage
          src={trip.imageUrl}
          alt={trip.destination}
          fallbackLabel={trip.destination}
          className="h-full w-full"
          width={144}
          height={144}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-bold text-white">{trip.destination}</h3>
          <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-wander-muted" aria-hidden />
        </div>
        <p className="text-xs font-medium text-white/55">{formatTripDateRange(trip.startDate, trip.endDate)}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide',
              STATUS_STYLE[trip.status]
            )}
          >
            {STATUS_LABEL[trip.status]}
          </span>
          {trip.companionAvatars.length > 0 ? (
            <div className="flex items-center pl-1">
              {shown.map((url, i) => (
                <div
                  key={`${trip.id}-c-${i}`}
                  className={cn('h-6 w-6 shrink-0 overflow-hidden rounded-full border-2 border-wander-card', i > 0 && '-ml-2')}
                >
                  <WanderImage src={url} alt="" fallbackLabel="友" className="h-full w-full" width={48} height={48} />
                </div>
              ))}
              {extra > 0 ? (
                <span className="-ml-2 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full border-2 border-wander-card bg-wander-surface px-1 text-[10px] font-bold text-wander-secondary">
                  +{extra}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </motion.button>
  );
}
