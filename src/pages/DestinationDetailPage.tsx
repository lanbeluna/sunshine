import { ChevronDown, ChevronLeft, Heart, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/lib/toast';
import { PageContainer } from '@/components/layout/PageContainer';
import { WanderImage } from '@/components/media/WanderImage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getDestinationById } from '@/data/destinations';
import { itineraryDayImageUrl } from '@/data/destinationImages';
import { formatTransportList } from '@/lib/transportLabels';
import { tripFromDestination } from '@/lib/tripFromDestination';
import { appendCustomTrip } from '@/lib/tripsStorage';
import {
  isDestinationFavorited,
  toggleDestinationFavorite,
} from '@/lib/wanderStorage';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';

type NavState = { matchPercent?: number } | null;

const SLIDE_LABELS = ['封面', '美食', '风景'] as const;

function defaultEndIso(daysAfterStart: number): string {
  const d = new Date();
  d.setDate(d.getDate() + 14 + daysAfterStart);
  return d.toISOString().slice(0, 10);
}

function defaultStartIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const navState = state as NavState;
  const { theme } = useAppContext();
  const light = theme === 'light';

  const dest = useMemo(() => (id ? getDestinationById(id) : undefined), [id]);
  const matchPct = navState?.matchPercent ?? dest?.matchScore ?? 88;

  const [favorited, setFavorited] = useState(false);
  const [slide, setSlide] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [planOpen, setPlanOpen] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartIso);
  const [endDate, setEndDate] = useState(() => defaultEndIso(3));

  const [openDays, setOpenDays] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!dest) return;
    setFavorited(isDestinationFavorited(dest.id));
  }, [dest]);

  useEffect(() => {
    if (!dest) return;
    const m: Record<number, boolean> = {};
    dest.itinerary.forEach((d) => {
      m[d.day] = d.day === 1;
    });
    setOpenDays(m);
  }, [dest?.id]);

  const onScrollCarousel = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const i = Math.round(el.scrollLeft / w);
    setSlide(Math.max(0, Math.min(2, i)));
  }, []);

  const toggleFav = () => {
    if (!dest) return;
    const next = toggleDestinationFavorite(dest.id);
    setFavorited(next);
    toast.message(next ? '已收藏目的地' : '已取消收藏');
  };

  const openPlanDialog = () => setPlanOpen(true);

  const confirmPlan = () => {
    if (!dest) return;
    if (startDate > endDate) {
      toast.error('结束日期不能早于开始日期');
      return;
    }
    const tid = `c-${Date.now()}`;
    appendCustomTrip(tripFromDestination(dest, startDate, endDate, tid));
    setPlanOpen(false);
    toast.success('已生成行程', { description: '已加入「我的行程」列表顶部。' });
    navigate('/trips');
  };

  const reDecide = () => {
    navigate('/decision');
  };

  if (!dest) {
    return (
      <PageContainer className="flex flex-col items-center justify-center px-6">
        <p className={cn('text-center text-sm', light ? 'text-zinc-600' : 'text-wander-secondary')}>未找到该目的地</p>
        <button
          type="button"
          onClick={() => navigate('/decision')}
          className="mt-4 text-sm font-semibold text-indigo-400"
        >
          返回 AI 决策
        </button>
      </PageContainer>
    );
  }

  const nights = Math.max(1, dest.itinerary.length - 1);
  const budgetLine = `${dest.budget.currency} ${dest.budget.min.toLocaleString()}–${dest.budget.max.toLocaleString()}`;
  const slides: { src: string; label: string }[] = [
    { src: dest.images.cover, label: SLIDE_LABELS[0] },
    { src: dest.images.food, label: SLIDE_LABELS[1] },
    { src: dest.images.scenery, label: SLIDE_LABELS[2] },
  ];

  const bottomOffset = 'calc(4.25rem + env(safe-area-inset-bottom, 0px))';

  return (
    <PageContainer className="pb-0">
      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={onScrollCarousel}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((s) => (
            <div key={s.label} className="relative w-full min-w-full snap-center">
              <div className="relative aspect-[16/11] w-full sm:aspect-[16/10]">
                <WanderImage
                  src={s.src}
                  alt={`${dest.name} ${s.label}`}
                  fallbackLabel={`${dest.name} · ${s.label}`}
                  className="absolute inset-0 h-full w-full"
                  imgClassName="h-full w-full object-cover"
                  width={960}
                  height={540}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {slides.map((_, di) => (
                    <span
                      key={di}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        di === slide ? 'w-6 bg-white' : 'w-1.5 bg-white/45'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-start p-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition active:scale-95"
            aria-label="返回"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className={cn('space-y-4 px-4 pb-48 pt-5', light ? 'text-zinc-900' : 'text-white')}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{dest.name}</h1>
            <p className={cn('mt-1 text-sm', light ? 'text-zinc-600' : 'text-wander-secondary')}>{dest.country}</p>
          </div>
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border border-indigo-500/35 bg-indigo-500/15 text-center">
            <span className="text-lg font-bold leading-none text-white">{matchPct}%</span>
            <span className="text-[9px] font-medium text-indigo-200">匹配</span>
          </div>
        </div>

        <blockquote
          className={cn(
            'relative border-l-4 py-3 pl-4 pr-2 text-sm leading-relaxed',
            light ? 'border-indigo-500 bg-indigo-50/80 text-zinc-800' : 'border-wander-brand bg-wander-card/90 text-wander-secondary'
          )}
        >
          <span className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            AI 推荐理由
          </span>
          {dest.description}
        </blockquote>

        <div className="grid grid-cols-2 gap-3">
          <InfoCell light={light} label="参考预算" value={budgetLine} />
          <InfoCell light={light} label="建议天数" value={`${dest.itinerary.length}天${nights}晚`} />
          <InfoCell light={light} label="最佳季节" value={dest.bestSeason} />
          <InfoCell light={light} label="推荐交通" value={formatTransportList(dest.tags.transport)} />
        </div>

        <div>
          <h2 className={cn('mb-2 text-xs font-semibold uppercase tracking-wider', light ? 'text-zinc-500' : 'text-wander-muted')}>
            亮点
          </h2>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
            {dest.highlights.map((h) => (
              <span
                key={h}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium',
                  light ? 'border-indigo-200 bg-indigo-50 text-indigo-900' : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200'
                )}
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className={cn('mb-2 text-xs font-semibold uppercase tracking-wider', light ? 'text-zinc-500' : 'text-wander-muted')}>
            完整行程建议
          </h2>
          <div className="flex flex-col gap-2">
            {dest.itinerary.map((d) => {
              const open = openDays[d.day] ?? false;
              const img = itineraryDayImageUrl(dest.images, d.day - 1);
              return (
                <Collapsible
                  key={d.day}
                  open={open}
                  onOpenChange={(next) => setOpenDays((prev) => ({ ...prev, [d.day]: next }))}
                >
                  <div
                    className={cn(
                      'overflow-hidden rounded-2xl border',
                      light ? 'border-zinc-200 bg-white' : 'border-white/10 bg-wander-card'
                    )}
                  >
                    <div className="relative aspect-[2/1] w-full max-h-40 sm:max-h-48">
                      <WanderImage
                        src={img}
                        alt={d.title}
                        fallbackLabel={`${dest.name} · ${d.title}`}
                        className="absolute inset-0 h-full w-full"
                        width={640}
                        height={320}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                        Day {d.day}
                      </span>
                    </div>
                    <CollapsibleTrigger
                      className={cn(
                        'flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition',
                        light ? 'hover:bg-zinc-50' : 'hover:bg-white/[0.04]'
                      )}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold">{d.title}</p>
                        <p className={cn('mt-0.5 line-clamp-2 text-xs', light ? 'text-zinc-600' : 'text-wander-secondary')}>
                          {d.activities.slice(0, 2).join(' · ')}
                        </p>
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
                        {d.activities.map((a) => (
                          <li key={a} className="flex gap-2">
                            <span className="text-indigo-400">·</span>
                            <span>{a}</span>
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
        <div className="mx-auto flex w-full max-w-[430px] items-center gap-2">
          <button
            type="button"
            onClick={toggleFav}
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition active:scale-95',
              favorited
                ? 'border-rose-500/40 bg-rose-500/15 text-rose-400'
                : light
                  ? 'border-zinc-200 bg-zinc-100 text-zinc-700'
                  : 'border-white/15 bg-wander-surface text-white'
            )}
            aria-label={favorited ? '已收藏' : '收藏'}
          >
            <Heart className={cn('h-6 w-6', favorited && 'fill-current')} />
          </button>
          <button
            type="button"
            onClick={openPlanDialog}
            className={cn(
              'h-12 min-w-0 flex-1 rounded-xl font-semibold text-white transition active:scale-[0.98]',
              'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25'
            )}
          >
            生成我的行程
          </button>
        </div>
        <div className="mx-auto mt-2 w-full max-w-[430px] text-center">
          <button type="button" onClick={reDecide} className="text-sm font-semibold text-wander-secondary underline-offset-2 hover:underline">
            重新决策
          </button>
        </div>
      </div>

      <Dialog open={planOpen} onOpenChange={setPlanOpen}>
        <DialogContent
          className={cn(
            'border-white/10 sm:max-w-md [&_svg]:text-white',
            light ? 'border-zinc-200 bg-white text-zinc-900 [&_svg]:text-zinc-700' : 'bg-wander-card text-white'
          )}
        >
          <DialogHeader>
            <DialogTitle className={light ? 'text-zinc-900' : 'text-white'}>选择出行日期</DialogTitle>
            <DialogDescription className={light ? 'text-zinc-600' : 'text-wander-secondary'}>
              将「{dest.name}」按当前行程建议加入「我的行程」。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <label className="grid gap-1.5 text-sm">
              <span className={light ? 'text-zinc-600' : 'text-wander-muted'}>开始日期</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={cn(
                  'h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40',
                  light ? 'border-zinc-200 bg-zinc-50 text-zinc-900' : 'border-white/15 bg-wander-surface text-white'
                )}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className={light ? 'text-zinc-600' : 'text-wander-muted'}>结束日期</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={cn(
                  'h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40',
                  light ? 'border-zinc-200 bg-zinc-50 text-zinc-900' : 'border-white/15 bg-wander-surface text-white'
                )}
              />
            </label>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setPlanOpen(false)}
              className={cn(
                'h-10 rounded-xl border px-4 text-sm font-semibold',
                light ? 'border-zinc-200 text-zinc-800' : 'border-white/15 text-wander-secondary'
              )}
            >
              取消
            </button>
            <button
              type="button"
              onClick={confirmPlan}
              className="h-10 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
            >
              确认添加
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

function InfoCell({
  light,
  label,
  value,
}: {
  light: boolean;
  label: string;
  value: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-3',
        light ? 'border-zinc-200 bg-zinc-50/80' : 'border-white/10 bg-wander-card'
      )}
    >
      <p className={cn('text-[10px] font-medium uppercase tracking-wider', light ? 'text-zinc-500' : 'text-wander-muted')}>{label}</p>
      <p className={cn('mt-1 text-sm font-bold leading-snug', light ? 'text-zinc-900' : 'text-white')}>{value}</p>
    </div>
  );
}
