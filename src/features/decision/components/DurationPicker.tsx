import { motion } from 'framer-motion';
import type { Duration } from '@/types/decision';
import { cn } from '@/lib/utils';

const OPTIONS: { value: Duration; label: string }[] = [
  { value: '1day', label: '1天' },
  { value: 'weekend', label: '2–3天' },
  { value: 'week', label: '一周' },
  { value: 'long', label: '半个月+' },
];

type Props = {
  value: Duration | undefined;
  onChange: (v: Duration) => void;
};

export function DurationPicker({ value, onChange }: Props) {
  return (
    <div className="px-4 pb-2">
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-wander-muted">滑动选择</p>
      <div
        className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="旅行时长"
      >
        {OPTIONS.map((opt, i) => {
          const on = value === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(opt.value)}
              aria-pressed={on}
              className={cn(
                'min-w-[calc(50%-6px)] shrink-0 snap-center rounded-2xl border px-4 py-4 text-center transition sm:min-w-[40%]',
                on
                  ? 'border-indigo-500/60 bg-gradient-to-br from-indigo-500/25 to-purple-500/20 shadow-wander-glow'
                  : 'border-white/10 bg-wander-surface'
              )}
            >
              <span className="text-lg font-bold text-white">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
