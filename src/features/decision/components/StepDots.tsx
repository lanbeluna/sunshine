import { cn } from '@/lib/utils';

export function StepDots({ step, total = 5 }: { step: number; total?: number }) {
  return (
    <div className="flex justify-center gap-2 px-4 pb-4" aria-label={`第 ${step + 1} 步，共 ${total} 步`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            i < step && 'w-2 bg-wander-brand/90',
            i === step && 'w-7 bg-gradient-to-r from-wander-brand to-wander-lilac shadow-wander-glow',
            i > step && 'w-2 bg-wander-border'
          )}
        />
      ))}
    </div>
  );
}
