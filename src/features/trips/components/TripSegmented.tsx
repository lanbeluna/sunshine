import { cn } from '@/lib/utils';

export type TripSegment = 'upcoming' | 'past';

type Props = {
  value: TripSegment;
  onChange: (v: TripSegment) => void;
};

export function TripSegmented({ value, onChange }: Props) {
  return (
    <div
      className="mx-4 flex rounded-full border border-white/10 bg-white/[0.06] p-1 backdrop-blur"
      role="tablist"
      aria-label="行程视图"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === 'upcoming'}
        onClick={() => onChange('upcoming')}
        className={cn(
          'ql-focus flex-1 rounded-full py-2.5 text-center text-sm font-semibold transition-colors active:scale-[0.98]',
          value === 'upcoming'
            ? 'bg-white text-zinc-950 shadow-md shadow-black/20'
            : 'text-white/55 hover:text-white'
        )}
      >
        即将出发
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === 'past'}
        onClick={() => onChange('past')}
        className={cn(
          'ql-focus flex-1 rounded-full py-2.5 text-center text-sm font-semibold transition-colors active:scale-[0.98]',
          value === 'past'
            ? 'bg-white text-zinc-950 shadow-md shadow-black/20'
            : 'text-white/55 hover:text-white'
        )}
      >
        历史足迹
      </button>
    </div>
  );
}
