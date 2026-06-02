import type { FeedCategoryId } from '@/types/wander';

export const EXPLORE_CATEGORIES: { id: FeedCategoryId; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'domestic', label: '国内游' },
  { id: 'international', label: '出境游' },
  { id: 'blitz', label: '特种兵' },
  { id: 'slow', label: '慢旅行' },
  { id: 'food', label: '美食' },
  { id: 'bnb', label: '民宿' },
  { id: 'pitfall', label: '避坑' },
  { id: 'budget', label: '穷游' },
  { id: 'family', label: '亲子' },
];

type Props = {
  active: FeedCategoryId;
  onChange: (id: FeedCategoryId) => void;
};

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="sticky top-[92px] z-10 border-b border-white/[0.06] bg-[#0b0b0e]/80 backdrop-blur-xl">
      <div className="flex gap-2 overflow-x-auto px-4 py-2.5 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {EXPLORE_CATEGORIES.map((c) => {
          const on = c.id === active;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              className={`ql-focus shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors active:scale-[0.96] ${
                on
                  ? 'bg-white text-zinc-950 shadow-ql-card'
                  : 'border border-white/[0.08] bg-white/[0.05] text-white/60 hover:text-white'
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
