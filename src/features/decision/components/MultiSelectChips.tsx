import { cn } from '@/lib/utils';

export type ChipOption<T extends string> = {
  value: T;
  emoji: string;
  label: string;
};

type Props<T extends string> = {
  options: ChipOption<T>[];
  selected: T[];
  min?: number;
  max?: number;
  onChange: (next: T[]) => void;
};

export function MultiSelectChips<T extends string>({
  options,
  selected,
  min = 1,
  max = 3,
  onChange,
}: Props<T>) {
  const toggle = (value: T) => {
    const has = selected.includes(value);
    if (has) {
      if (selected.length <= min) return;
      onChange(selected.filter((x) => x !== value));
      return;
    }
    if (selected.length >= max) {
      onChange([...selected.slice(1), value]);
      return;
    }
    onChange([...selected, value]);
  };

  return (
    <div className="px-4 pt-4" role="group" aria-label="多选旅行活动">
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const on = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              aria-pressed={on}
              className={cn(
                'ql-focus min-h-[76px] rounded-2xl border px-3 py-3 text-left transition-colors active:scale-[0.98]',
                on
                  ? 'border-wander-coral/70 bg-wander-coral/15 text-white shadow-wander-glow'
                  : 'border-white/10 bg-white/[0.05] text-wander-secondary hover:bg-white/[0.08]'
              )}
            >
              <span className="block text-xl leading-none" aria-hidden>
                {option.emoji}
              </span>
              <span className="mt-2 block text-sm font-semibold">{option.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[11px] text-wander-muted">请选择 {min}-{max} 个旅行活动标签</p>
    </div>
  );
}
