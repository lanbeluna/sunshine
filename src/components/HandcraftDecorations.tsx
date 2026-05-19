import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** 与胶带、印章共用的色板键 */
export type HandcraftColor = 'mint' | 'butter' | 'coral' | 'sky' | 'lavender' | 'white';

const tapeGradient: Record<HandcraftColor, string> = {
  mint: 'from-mint/75 via-mint/50 to-mint/35',
  butter: 'from-butter/80 via-butter/55 to-butter/40',
  coral: 'from-coral/75 via-coral/50 to-coral/38',
  sky: 'from-sky/70 via-sky/48 to-sky/32',
  lavender: 'from-lavender/72 via-lavender/48 to-lavender/34',
  white: 'from-white/90 via-white/65 to-white/45',
};

const stampRing: Record<HandcraftColor, string> = {
  mint: 'border-mint/55 text-mint',
  butter: 'border-butter/70 text-ink',
  coral: 'border-coral/65 text-coral',
  sky: 'border-sky/60 text-ink',
  lavender: 'border-lavender/60 text-ink',
  white: 'border-pencil-line text-ink',
};

function tapeRotation(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return (h % 7) - 3;
}

export type TapeProps = {
  color: HandcraftColor;
  children?: ReactNode;
  className?: string;
  /** 覆盖随机 ±3° */
  rotationDeg?: number;
  /** inline：参与文档流；floating：绝对定位（默认） */
  layout?: 'floating' | 'inline';
};

/**
 * 和纸胶带：半透明条带 + 细微横纹 + 暖色投影
 */
export function Tape({
  color,
  children,
  className,
  rotationDeg,
  layout = 'floating',
}: TapeProps) {
  const rot = rotationDeg ?? tapeRotation(`${color}-${typeof children === 'string' ? children : 'tape'}`);
  return (
    <span
      className={cn(
        'z-30 inline-flex items-center justify-center',
        'min-h-[2rem] min-w-[4.5rem] px-4 py-1.5 font-script text-sm font-semibold text-ink/90',
        'bg-gradient-to-br shadow-handcraft',
        'border border-white/45',
        tapeGradient[color],
        layout === 'floating' && 'pointer-events-none absolute',
        className
      )}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <span
        className="absolute inset-0 bg-[repeating-linear-gradient(108deg,transparent,transparent_3px,rgba(255,255,255,0.14)_3px,rgba(255,255,255,0.14)_4px)]"
        aria-hidden
      />
      {children ? <span className="relative">{children}</span> : null}
    </span>
  );
}

export type PaperClipProps = {
  className?: string;
};

/** 金属回形针，别在卡片左上角 */
export function PaperClip({ className }: PaperClipProps) {
  return (
    <svg
      className={cn(
        'pointer-events-none absolute -left-0 -top-3 z-20 h-14 w-7 -rotate-[15deg]',
        className
      )}
      viewBox="0 0 28 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="hc-clip-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E5E7EB" />
          <stop offset="45%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#6B7280" />
        </linearGradient>
      </defs>
      <path
        d="M10 8v36c0 4 3.5 7 8 7s8-3 8-7V14c0-5-4-9-9-9s-9 4-9 9v28c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5V18"
        stroke="url(#hc-clip-shine)"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type StampProps = {
  text: string;
  color: HandcraftColor;
  className?: string;
};

/** 圆形虚线邮戳 */
export function Stamp({ text, color, className }: StampProps) {
  return (
    <div
      className={cn(
        'flex h-[4.25rem] w-[4.25rem] rotate-[12deg] select-none items-center justify-center',
        'rounded-full border-[2.5px] border-dashed bg-white/93 px-1.5 text-center font-serif text-[10px] font-bold leading-tight text-ink shadow-handcraft',
        stampRing[color],
        className
      )}
      aria-hidden
    >
      {text}
    </div>
  );
}

export type HandLineProps = {
  variant?: 'wave' | 'straight';
  className?: string;
};

/** 手绘感下划线 / 分隔线 */
export function HandLine({ variant = 'wave', className }: HandLineProps) {
  const d =
    variant === 'wave'
      ? 'M0 9 C28 3 52 14 80 8 C108 2 132 13 160 7 C188 1 212 12 240 6 C268 0 292 11 320 5'
      : 'M0 8 L320 8';
  return (
    <svg
      className={cn('h-5 w-full max-w-xl text-pencil-line', className)}
      viewBox="0 0 320 16"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 7"
      />
    </svg>
  );
}

export type HandLineVerticalProps = {
  className?: string;
};

/** 竖向波浪线，用作时间轴连接线 */
export function HandLineVertical({ className }: HandLineVerticalProps) {
  return (
    <svg
      className={cn('block h-full w-3 text-pencil-line', className)}
      viewBox="0 0 12 200"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 0 Q9 20 6 40 Q3 60 6 80 Q9 100 6 120 Q3 140 6 160 Q9 180 6 200"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeDasharray="4 6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export type StickyTapeProps = {
  children: ReactNode;
  className?: string;
};

/**
 * 顶部撕边胶带区块：clip-path 锯齿 + 暖色底
 */
export function StickyTape({ children, className }: StickyTapeProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-b-2xl bg-butter/30 px-5 pb-5 pt-7 shadow-handcraft',
        className
      )}
      style={{
        clipPath:
          'polygon(0% 14px,3% 8px,6% 13px,9% 7px,12% 12px,15% 6px,18% 11px,21% 7px,24% 13px,27% 8px,30% 12px,33% 6px,36% 11px,39% 8px,42% 14px,45% 7px,48% 12px,51% 6px,54% 13px,57% 8px,60% 11px,63% 7px,66% 12px,69% 6px,72% 14px,75% 8px,78% 11px,81% 7px,84% 12px,87% 6px,90% 13px,93% 8px,96% 11px,100% 14px,100% 100%,0% 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-paper/50 to-transparent"
        aria-hidden
      />
      {children}
    </div>
  );
}

export type PencilTodoItemProps = {
  label: string;
  icon?: string;
  /** 清单项默认视为「已勾选」推荐携带 */
  checked?: boolean;
  className?: string;
};

/** 手绘方框 + 铅笔感打勾 */
export function PencilTodoItem({
  label,
  icon,
  checked = true,
  className,
}: PencilTodoItemProps) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <svg
        className="mt-0.5 h-6 w-6 shrink-0 text-ink"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="3.5 2.5"
        />
        {checked ? (
          <path
            d="M7 12 L10.5 15.5 L17 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 3"
          />
        ) : null}
      </svg>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {icon ? <span className="text-lg leading-none">{icon}</span> : null}
          <span className="font-serif text-sm text-ink">{label}</span>
        </div>
      </div>
    </div>
  );
}
