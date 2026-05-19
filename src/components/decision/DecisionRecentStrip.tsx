import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WanderImage } from '@/components/media/WanderImage';
import { getDestinationById } from '@/data/destinations';
import { loadDecisionHistory, type DecisionHistoryItem } from '@/lib/decisionHistoryStore';
import { cn } from '@/lib/utils';

function formatDecisionDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

type Props = {
  /** 为 true 时重新读取历史（如从 idle 进入） */
  refreshKey: number | string;
};

export function DecisionRecentStrip({ refreshKey }: Props) {
  const navigate = useNavigate();
  const [items, setItems] = useState<DecisionHistoryItem[]>([]);

  useEffect(() => {
    setItems(loadDecisionHistory().slice(0, 3));
  }, [refreshKey]);

  const resolved = useMemo(() => {
    return items
      .map((row) => {
        const dest = getDestinationById(row.destinationId);
        if (!dest) return null;
        return { row, dest };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [items]);

  return (
    <section className="mt-6 px-4 pb-24">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-zinc-500">最近为你决策</h3>
        <Link
          to="/profile/decision-history"
          className="shrink-0 text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
        >
          查看全部 →
        </Link>
      </div>

      {resolved.length === 0 ? (
        <p className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-8 text-center text-sm text-zinc-500 backdrop-blur-xl">
          还没有决策记录，开始你的第一次冒险吧
        </p>
      ) : (
        <div
          className={cn(
            '-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pl-1 pr-4',
            '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
          )}
        >
          {resolved.map(({ row, dest }) => (
            <button
              key={`${row.destinationId}-${row.at}`}
              type="button"
              onClick={() =>
                navigate(`/destination/${dest.id}`, { state: { matchPercent: row.matchPercent } })
              }
              className={cn(
                'flex h-20 w-[200px] shrink-0 snap-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-2.5 text-left backdrop-blur-xl',
                'shadow-sm transition active:scale-[0.98] hover:border-indigo-500/35'
              )}
            >
              <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
                <WanderImage
                  src={dest.images.cover}
                  alt={dest.name}
                  fallbackLabel={dest.name}
                  className="h-full w-full object-cover"
                  width={120}
                  height={120}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-0.5">
                <p className="truncate text-sm font-medium text-white">{dest.name}</p>
                <p className="text-xs text-zinc-500">{formatDecisionDate(row.at)}</p>
                <span className="mt-1 inline-flex w-fit rounded-full bg-indigo-500/25 px-2 py-0.5 text-xs font-semibold text-indigo-200">
                  {row.matchPercent}%匹配
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
