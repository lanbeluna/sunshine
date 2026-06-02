import { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProfileSubPageLayout } from '@/features/profile/components/ProfileSubPageLayout';
import { WanderImage } from '@/components/media/WanderImage';
import { getDestinationById } from '@/data/destinations';
import { loadDecisionHistory } from '@/lib/decisionHistoryStore';
import { itineraryDayImageUrl } from '@/data/destinationImages';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

function formatDecisionDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export default function DecisionHistoryPage() {
  const navigate = useNavigate();
  const { theme } = useAppContext();
  const light = theme === 'light';

  const items = useMemo(() => loadDecisionHistory(), []);

  return (
    <ProfileSubPageLayout title="决策历史">
      <div className="px-4 pb-24 pt-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <WanderImage
              src=""
              alt=""
              fallbackLabel="决策"
              className="mb-5 h-36 w-full max-w-[280px] overflow-hidden rounded-2xl shadow-lg shadow-black/20"
              width={560}
              height={288}
            />
            <p className={cn('text-sm', light ? 'text-zinc-600' : 'text-wander-secondary')}>还没有决策记录</p>
            <Link
              to="/decision"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
            >
              去决策
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((row) => {
              const dest = getDestinationById(row.destinationId);
              const thumb = dest ? itineraryDayImageUrl(dest.images, 0) : '';
              const name = dest?.name ?? row.destinationId;
              return (
                <li key={`${row.destinationId}-${row.at}`}>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/destination/${row.destinationId}`, {
                        state: { matchPercent: row.matchPercent },
                      })
                    }
                    className={cn(
                      'flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[0.99]',
                      light ? 'border-zinc-200 bg-white active:bg-zinc-50' : 'border-white/10 bg-wander-card active:bg-white/[0.04]'
                    )}
                  >
                    <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-xl bg-wander-surface">
                      <WanderImage src={thumb} alt={name} fallbackLabel={name} className="h-full w-full" width={120} height={120} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn('font-semibold', light ? 'text-zinc-900' : 'text-white')}>{name}</p>
                      <p className={cn('mt-0.5 text-xs', light ? 'text-zinc-500' : 'text-wander-muted')}>{formatDecisionDate(row.at)}</p>
                      <p className="mt-1 text-xs font-medium text-indigo-400">{row.matchPercent}% 匹配</p>
                    </div>
                    <ChevronRight className={cn('h-5 w-5 shrink-0', light ? 'text-zinc-400' : 'text-wander-muted')} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </ProfileSubPageLayout>
  );
}
