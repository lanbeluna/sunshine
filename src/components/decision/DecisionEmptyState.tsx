import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { DecisionEarthHero } from '@/components/decision/DecisionEarthHero';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const HINT = '不知道去哪？让AI帮你决定';
const TYPEWRITER_DONE_KEY = 'ql_decision_cta_typewriter_done';
const TYPEWRITER_DONE_LEGACY = 'wanderai_decision_cta_typewriter_done';

function isTypewriterDone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.getItem(TYPEWRITER_DONE_KEY) === '1' ||
    localStorage.getItem(TYPEWRITER_DONE_LEGACY) === '1'
  );
}

type Props = {
  onStart: () => void;
};

type Ripple = { id: number; x: number; y: number };

export function DecisionEmptyState({ onStart }: Props) {
  const { theme } = useAppContext();
  const light = theme === 'light';
  const btnRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [hintText, setHintText] = useState(() => {
    if (typeof window === 'undefined') return '';
    return isTypewriterDone() ? HINT : '';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(TYPEWRITER_DONE_LEGACY) === '1' && localStorage.getItem(TYPEWRITER_DONE_KEY) !== '1') {
      try {
        localStorage.setItem(TYPEWRITER_DONE_KEY, '1');
      } catch {
        /* ignore */
      }
    }
    if (localStorage.getItem(TYPEWRITER_DONE_KEY) === '1') return;
    let i = 0;
    const step = () => {
      i += 1;
      setHintText(HINT.slice(0, i));
      if (i >= HINT.length) {
        try {
          localStorage.setItem(TYPEWRITER_DONE_KEY, '1');
        } catch {
          /* ignore */
        }
        return;
      }
      window.setTimeout(step, 42);
    };
    const t = window.setTimeout(step, 280);
    return () => window.clearTimeout(t);
  }, []);

  const handlePointer = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      const el = btnRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      const id = rippleId.current++;
      const x = clientX - r.left;
      const y = clientY - r.top;
      setRipples((prev) => [...prev, { id, x, y }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((p) => p.id !== id));
      }, 560);
    },
    []
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handlePointer(e);
    onStart();
  };

  return (
    <div className="flex flex-col items-center px-4 pb-6 text-center">
      <div className="mt-6 flex h-48 w-full max-w-[320px] items-center justify-center">
        <DecisionEarthHero />
      </div>

      <p
        className={cn(
          'mt-4 min-h-[1.25rem] text-center text-sm',
          light ? 'text-zinc-500' : 'text-zinc-400'
        )}
      >
        {hintText}
        {hintText.length > 0 && hintText.length < HINT.length ? (
          <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-indigo-400/80 align-middle" />
        ) : null}
      </p>

      <div className="mt-4 w-full px-4">
        <motion.button
          ref={btnRef}
          type="button"
          onClick={handleClick}
          onPointerDown={(e) => {
            if (e.pointerType === 'touch') handlePointer(e as unknown as React.MouseEvent<HTMLButtonElement>);
          }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'relative flex h-[52px] w-full max-w-md items-center justify-center gap-2 overflow-hidden rounded-2xl font-bold text-lg text-white',
            'mx-auto w-[calc(100%-32px)] transition-transform duration-200',
            'animate-wander-cta-breathe'
          )}
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)',
          }}
        >
          {ripples.map((p) => (
            <span
              key={p.id}
              className="pointer-events-none absolute"
              style={{ left: p.x, top: p.y }}
            >
              <span className="block h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 animate-wander-cta-ripple" />
            </span>
          ))}
          <Sparkles
            className="relative z-[1] h-6 w-6 shrink-0 animate-wander-sparkle-glint text-white"
            strokeWidth={2.25}
          />
          <span className="relative z-[1]">✨ 开始决策</span>
        </motion.button>
      </div>
    </div>
  );
}
