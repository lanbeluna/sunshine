import { cn } from '@/lib/utils';

export type TripSegment = 'upcoming' | 'past';

type Props = {
  value: TripSegment;
  onChange: (v: TripSegment) => void;
};

export function TripSegmented({ value, onChange }: Props) {
  return (
    <div
      className="mx-4 flex rounded-xl border border-white/10 bg-wander-surface/80 p-1"
      role="tablist"
      aria-label="行程视图"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === 'upcoming'}
        onClick={() => onChange('upcoming')}
        className={cn(
          'flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition active:scale-[0.98]',
          value === 'upcoming'
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20'
            : 'text-wander-secondary hover:text-white'
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
          'flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition active:scale-[0.98]',
          value === 'past'
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20'
            : 'text-wander-secondary hover:text-white'
        )}
      >
        历史足迹
      </button>
    </div>
  );
}
