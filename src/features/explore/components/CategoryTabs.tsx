import type { FeedCategoryId } from '@/types/wander';

const EXPLORE_CATEGORIES: { id: FeedCategoryId; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'domestic', label: '国内游' },
  { id: 'international', label: '出境游' },
  { id: 'blitz', label: '特种兵' },
  { id: 'slow', label: '慢旅行' },
  { id: 'food', label: '美食' },
  { id: 'bnb', label: '民宿' },
  { id: 'pitfall', label: '避坑' },
  { id: 'budget', label: '低预算' },
  { id: 'family', label: '亲子' },
];

type Props = {
  active: FeedCategoryId;
  onChange: (id: FeedCategoryId) => void;
};

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="sticky top-[92px] z-10 border-b border-white/70 bg-white/74 backdrop-blur-xl">
      <div className="flex gap-2 overflow-x-auto px-4 py-2.5 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {EXPLORE_CATEGORIES.map((c) => {
          const on = c.id === active;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              className={`ql-focus shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide transition-colors active:scale-[0.96] ${
                on
                  ? 'bg-wander-coral text-white shadow-lg shadow-rose-300/25'
                  : 'border border-white/80 bg-white/58 text-slate-500 shadow-sm hover:text-slate-800'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
