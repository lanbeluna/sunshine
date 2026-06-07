import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/lib/toast';
import { PageContainer } from '@/components/layout/PageContainer';
import { WanderImage } from '@/components/media/WanderImage';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getTripById } from '@/data/mockTrips';
import { removeCustomTrip } from '@/lib/tripsStorage';
import { formatTripDateRange } from '@/lib/formatTripDate';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/useAppContext';
import type { TripStatus } from '@/types/trip';

const STATUS_LABEL: Record<TripStatus, string> = {
  planned: '计划中',
  ongoing: '进行中',
  done: '已完成',
};

function makeOpenDays(days: { day: number }[]): Record<number, boolean> {
  const map: Record<number, boolean> = {};
  days.forEach((day) => {
    map[day.day] = day.day === 1;
  });
  return map;
}

function statusPillClass(status: TripStatus, light: boolean): string {
  if (light) {
    switch (status) {
      case 'planned':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'ongoing':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'done':
        return 'bg-zinc-200 text-zinc-700 border-zinc-300';
    }
  }
  switch (status) {
    case 'planned':
      return 'bg-amber-500/25 text-amber-200 border-amber-500/45';
    case 'ongoing':
      return 'bg-emerald-500/25 text-emerald-200 border-emerald-500/45';
    case 'done':
      return 'bg-zinc-600/50 text-zinc-300 border-zinc-500/40';
  }
}

export default function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { theme } = useAppContext();
  const light = theme === 'light';

  const trip = useMemo(() => (tripId ? getTripById(tripId) : undefined), [tripId]);

  const [openDaysState, setOpenDaysState] = useState<{ id: string; values: Record<number, boolean> } | null>(null);

  if (!trip) {
    return (
      <PageContainer className="flex flex-col items-center justify-center px-6">
        <p className={cn('text-center text-sm', light ? 'text-zinc-600' : 'text-wander-secondary')}>未找到该行程</p>
        <button
          type="button"
          onClick={() => navigate('/trips', { replace: true })}
          className="mt-4 text-sm font-semibold text-indigo-400"
        >
          返回行程列表
        </button>
      </PageContainer>
    );
  }

  const onEdit = () => {
    toast.info('编辑行程', { description: '演示环境：可在这里接入日程拖拽、酒店与交通编辑。' });
  };

  const onDelete = () => {
    if (window.confirm(`确定删除「${trip.destination}」吗？`)) {
      if (trip.id.startsWith('c-')) {
        removeCustomTrip(trip.id);
        toast.success('已删除行程');
      } else {
        toast.success('已删除（演示）', { description: '内置示例行程仅隐藏本次会话，刷新后仍会显示。' });
      }
      navigate('/trips', { replace: true });
    }
  };

  const bottomOffset = 'calc(4.25rem + env(safe-area-inset-bottom, 0px))';
  const openDays = openDaysState?.id === trip.id ? openDaysState.values : makeOpenDays(trip.itinerary);

  return (
    <PageContainer className="pb-0">
      <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden sm:aspect-[16/10]">
        <WanderImage
          src={trip.imageUrl}
          alt={trip.destination}
          fallbackLabel={trip.destination}
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full"
          width={960}
          height={540}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/88 via-black/40 to-black/10" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => navigate('/trips')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition active:scale-95"
            aria-label="杩斿洖"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className={cn('space-y-4 px-4 pb-40 pt-5', light ? 'text-zinc-900' : 'text-white')}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{trip.destination}</h1>
          <p className={cn('mt-2 text-sm font-medium', light ? 'text-zinc-600' : 'text-wander-secondary')}>
            {formatTripDateRange(trip.startDate, trip.endDate)}
          </p>
          <span
            className={cn(
              'mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold',
              statusPillClass(trip.status, light)
            )}
          >
            {STATUS_LABEL[trip.status]}
          </span>
        </div>

        <div>
          <h2 className={cn('mb-2 text-xs font-semibold uppercase tracking-wider', light ? 'text-zinc-500' : 'text-wander-muted')}>
            每日行程
          </h2>
          <div className="flex flex-col gap-2">
            {trip.itinerary.map((d) => {
              const open = openDays[d.day] ?? false;
              return (
                <Collapsible
                  key={d.day}
                  open={open}
                  onOpenChange={(next) =>
                    setOpenDaysState((prev) => ({
                      id: trip.id,
                      values: { ...(prev?.id === trip.id ? prev.values : openDays), [d.day]: next },
                    }))
                  }
                >
                  <div
                    className={cn(
                      'overflow-hidden rounded-2xl border',
                      light ? 'border-zinc-200 bg-white' : 'border-white/10 bg-wander-card'
                    )}
                  >
                    <CollapsibleTrigger
                      className={cn(
                        'flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition',
                        light ? 'hover:bg-zinc-50' : 'hover:bg-white/[0.04]'
                      )}
                    >
                      <div className="min-w-0">
                        <p className={cn('text-[10px] font-bold uppercase tracking-wider', light ? 'text-indigo-600' : 'text-indigo-300')}>
                          Day {d.day}
                        </p>
                        <p className="mt-0.5 font-semibold">{d.title}</p>
                        <p className={cn('mt-1 text-xs', light ? 'text-zinc-600' : 'text-wander-secondary')}>{d.summary}</p>
                      </div>
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 shrink-0 transition-transform duration-200',
                          open && 'rotate-180',
                          light ? 'text-zinc-400' : 'text-wander-muted'
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul
                        className={cn(
                          'space-y-2 border-t px-4 py-3 text-sm leading-relaxed',
                          light ? 'border-zinc-100 bg-zinc-50/80 text-zinc-800' : 'border-white/5 bg-black/20 text-wander-secondary'
                        )}
                      >
                        {d.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-indigo-400">路</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={cn(
          'fixed left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t px-4 py-3 backdrop-blur-xl',
          light ? 'border-zinc-200/90 bg-white/95' : 'border-white/10 bg-wander-bg/95'
        )}
        style={{ bottom: bottomOffset }}
      >
        <div className="mx-auto flex w-full max-w-[430px] items-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            className={cn(
              'h-11 flex-1 rounded-xl font-semibold transition active:scale-[0.98]',
              light
                ? 'bg-zinc-900 text-white shadow-md'
                : 'border border-white/15 bg-wander-surface text-white shadow-lg active:bg-white/5'
            )}
          >
            缂栬緫琛岀▼
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="h-11 shrink-0 px-3 text-sm font-semibold text-rose-500 transition active:opacity-80"
          >
            鍒犻櫎琛岀▼
          </button>
        </div>
      </div>
    </PageContainer>
  );
}

