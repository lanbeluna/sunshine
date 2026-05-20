import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type OptionItem<T extends string> = { value: T; emoji: string; label: string };

type Props<T extends string> = {
  options: OptionItem<T>[];
  selected: T | undefined;
  onSelect: (v: T) => void;
};

export function OptionGrid<T extends string>({ options, selected, onSelect }: Props<T>) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 min-[430px]:gap-4">
      {options.map((opt, i) => {
        const on = selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.28 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(opt.value)}
            className={cn(
              'relative flex min-h-[92px] flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-3 text-center transition duration-200',
              on
                ? 'border-indigo-500/60 bg-gradient-to-br from-indigo-500/25 to-purple-500/20 shadow-wander-glow'
                : 'border-white/10 bg-wander-surface active:bg-white/5'
            )}
          >
            <span className="text-2xl" aria-hidden>
              {opt.emoji}
            </span>
            <span className="text-xs font-medium text-white">{opt.label}</span>
            {on && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-wander-brand text-white shadow-lg"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
