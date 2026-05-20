import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { WanderImage } from '@/components/media/WanderImage';
import type { Destination } from '@/types/decision';
import { cn } from '@/lib/utils';

type Props = {
  flipped: boolean;
  disabled?: boolean;
  preview: Destination | null;
  onActivate: () => void;
};

function blindTagline(dest: Destination): string {
  const h = dest.highlights[0];
  if (h) return h;
  const t = dest.description.trim();
  if (t.length <= 46) return t;
  return `${t.slice(0, 44)}…`;
}

/** 礼盒 + 骰子意象的扁平 SVG，带轻微浮动 */
function BlindGiftDiceIcon() {
  return (
    <svg
      viewBox="0 0 120 108"
      className="mx-auto h-[76px] w-[92px] animate-wander-dice-float drop-shadow-[0_8px_24px_rgba(99,102,241,0.35)]"
      aria-hidden
    >
      <defs>
        <linearGradient id="blind-gift-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="blind-gift-side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="blind-gift-front" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#5B21B6" stopOpacity="0.88" />
        </linearGradient>
      </defs>
      {/* 等距立方体面 — 简化为礼盒体 */}
      <path
        d="M60 18 L98 38 L60 58 L22 38 Z"
        fill="url(#blind-gift-top)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.8"
      />
      <path
        d="M22 38 L60 58 L60 96 L22 76 Z"
        fill="url(#blind-gift-side)"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.6"
      />
      <path
        d="M60 58 L98 38 L98 76 L60 96 Z"
        fill="url(#blind-gift-front)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.6"
      />
      {/* 缎带 */}
      <path d="M60 38v58" stroke="rgba(255,255,255,0.35)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M32 52h56" stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" strokeLinecap="round" />
      {/* 蝴蝶结 */}
      <ellipse cx="48" cy="22" rx="14" ry="8" fill="#C4B5FD" opacity="0.85" />
      <ellipse cx="72" cy="22" rx="14" ry="8" fill="#A78BFA" opacity="0.9" />
      <circle cx="60" cy="22" r="5" fill="#F5F3FF" opacity="0.95" />
      {/* 骰点暗示 */}
      <circle cx="34" cy="52" r="2.2" fill="white" opacity="0.5" />
      <circle cx="44" cy="64" r="2.2" fill="white" opacity="0.35" />
      <circle cx="82" cy="54" r="2.2" fill="white" opacity="0.45" />
    </svg>
  );
}

function CornerFrames() {
  const arm = 'h-4 w-4';
  const thick = 'border-white/20';
  return (
    <>
      <div className={cn('pointer-events-none absolute left-3 top-3 border-l-2 border-t-2 rounded-tl', arm, thick)} />
      <div className={cn('pointer-events-none absolute right-3 top-3 border-r-2 border-t-2 rounded-tr', arm, thick)} />
      <div className={cn('pointer-events-none absolute bottom-3 left-3 border-b-2 border-l-2 rounded-bl', arm, thick)} />
      <div className={cn('pointer-events-none absolute bottom-3 right-3 border-b-2 border-r-2 rounded-br', arm, thick)} />
    </>
  );
}

export function BlindBoxCard({ flipped, disabled, preview, onActivate }: Props) {
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (!flipped || !preview) return;
    setBurst((b) => b + 1);
  }, [flipped, preview?.id]);

  const gridStyle = {
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
  } as const;

  const glassFace: CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    ...gridStyle,
  };

  return (
    <div className="mt-6 px-4 pb-6">
      <div className="mx-auto w-full max-w-md perspective-[1200px]">
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && onActivate()}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 76, damping: 15, mass: 0.85 }}
          className="relative min-h-[280px] w-full origin-center cursor-pointer [transform-style:preserve-3d] disabled:cursor-not-allowed disabled:opacity-55"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 正面 */}
          <div
            className="absolute inset-0 flex flex-col rounded-[20px] p-6 text-center shadow-[0_0_40px_rgba(99,102,241,0.1)] [backface-visibility:hidden]"
            style={{
              backfaceVisibility: 'hidden',
              ...glassFace,
            }}
          >
            <CornerFrames />
            <div className="relative z-[1] flex flex-1 flex-col">
              <BlindGiftDiceIcon />
              <h3 className="mt-3 font-semibold text-white">交给命运吧 ✨</h3>
              <p className="mt-1.5 text-xs text-zinc-500">点按翻转 · 随机目的地</p>
              <div className="mt-auto flex justify-center gap-2 pt-6">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 w-1.5 rounded-full transition-all',
                      i === 1 ? 'scale-125 bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.7)]' : 'bg-zinc-600'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 背面 */}
          <div
            className="absolute inset-0 flex flex-col rounded-[20px] p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              ...glassFace,
            }}
          >
            <CornerFrames />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-[20px]">
              {burst > 0 ? (
                <motion.div
                  key={burst}
                  initial={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {Array.from({ length: 8 }).map((_, i) => {
                    const a = (i / 8) * Math.PI * 2;
                    const dist = 52 + (i % 3) * 8;
                    return (
                      <motion.span
                        key={i}
                        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-violet-200 to-cyan-200 shadow-[0_0_10px_rgba(196,181,253,0.9)]"
                        initial={{ x: 0, y: 0, opacity: 0.95, scale: 1 }}
                        animate={{
                          x: Math.cos(a) * dist,
                          y: Math.sin(a) * dist,
                          opacity: 0,
                          scale: 0.15,
                        }}
                        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1], delay: i * 0.02 }}
                      />
                    );
                  })}
                </motion.div>
              ) : null}
            </div>
            <div className="relative z-[1] flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
              {preview ? (
                <>
                  <div className="relative h-[100px] w-[100px] overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-lg shadow-indigo-500/20">
                    <WanderImage
                      src={preview.images.cover}
                      alt={preview.name}
                      fallbackLabel={preview.name}
                      className="h-full w-full object-cover"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div>
                    <p className="text-center text-lg font-semibold text-white">{preview.name}</p>
                    <p className="mt-0.5 text-center text-[11px] text-zinc-500">{preview.country}</p>
                  </div>
                  <p className="line-clamp-3 max-w-[240px] text-center text-xs leading-relaxed text-zinc-400">
                    {blindTagline(preview)}
                  </p>
                  <p className="mt-1 text-center text-[10px] text-zinc-600">再点卡片 · 换一个随机目的地</p>
                </>
              ) : (
                <p className="text-sm text-zinc-500">抽取中…</p>
              )}
              <div className="mt-auto flex justify-center gap-2 pt-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      preview && i === 1
                        ? 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.65)]'
                        : 'bg-zinc-600'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
