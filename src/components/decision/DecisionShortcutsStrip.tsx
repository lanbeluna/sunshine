import { motion } from 'framer-motion';
import { DECISION_QUICK_PRESETS } from '@/data/decisionQuickPresets';
import { cn } from '@/lib/utils';
import type { UserDecisionProfile } from '@/types/decision';

type Props = {
  disabled?: boolean;
  onPick: (profile: UserDecisionProfile) => void;
};

export function DecisionShortcutsStrip({ disabled, onPick }: Props) {
  return (
    <section className="mt-8 px-4 pb-2">
      <h3 className="mb-3 text-sm font-medium text-zinc-500">热门决策场景</h3>
      <div
        className={cn(
          '-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pl-1 pr-4',
          '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
        )}
      >
        {DECISION_QUICK_PRESETS.map((p) => (
          <motion.button
            key={p.id}
            type="button"
            disabled={disabled}
            whileTap={disabled ? undefined : { scale: 0.95 }}
            onClick={() => !disabled && onPick(p.profile)}
            className={cn(
              'relative flex h-[100px] w-[140px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/[0.08] p-3 text-left shadow-lg',
              'bg-white/[0.03] backdrop-blur-xl transition-[transform,box-shadow] duration-200',
              'disabled:pointer-events-none disabled:opacity-45'
            )}
          >
            <span
              className={cn('pointer-events-none absolute inset-0 opacity-[0.72]', p.gradientClass)}
              aria-hidden
            />
            <span className="relative z-[1] text-2xl leading-none" aria-hidden>
              {p.emoji}
            </span>
            <span className="relative z-[1] mt-2 text-sm font-semibold text-white">{p.title}</span>
            <span className="relative z-[1] mt-auto text-xs text-zinc-500">{p.subtitle}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
