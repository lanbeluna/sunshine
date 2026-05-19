import { MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { pickCover } from '@/lib/unsplashPools';
import { cn } from '@/lib/utils';

type Props = {
  src: string;
  alt?: string;
  /** 加载失败时展示的地点名等（与 alt 一起决定中性占位文案） */
  fallbackLabel?: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
};

const FALLBACK_BG = ['#2D3748', '#4A5568', '#1A202C', '#374151'] as const;

function pickNeutralBg(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return FALLBACK_BG[h % FALLBACK_BG.length]!;
}

export function WanderImage({
  src,
  alt = '',
  fallbackLabel,
  className,
  imgClassName,
  width,
  height,
}: Props) {
  const [phase, setPhase] = useState<'loading' | 'ok' | 'err'>('loading');
  const [failGen, setFailGen] = useState(0);
  const displayName = (alt && alt.trim()) || (fallbackLabel && fallbackLabel.trim()) || '图片';
  const bg = pickNeutralBg(displayName + src);
  const w = width ?? 960;
  const h = height ?? 640;

  const resolvedSrc = useMemo(() => {
    const primary = src?.trim() ?? '';
    if (failGen === 0 && primary) return primary;
    return pickCover(`${displayName}|${primary}|fb${failGen}`, w, h);
  }, [src, displayName, failGen, w, h]);

  useEffect(() => {
    setPhase('loading');
    setFailGen(0);
  }, [src]);

  if (phase === 'err') {
    return (
      <div
        className={cn('flex flex-col items-center justify-center gap-2 px-3 text-center', className)}
        style={{ backgroundColor: bg }}
      >
        <MapPin className="h-7 w-7 shrink-0 text-white/75" aria-hidden />
        <span className="line-clamp-3 text-xs font-semibold leading-snug text-white">{displayName}</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-wander-surface', className)}>
      <img
        key={resolvedSrc}
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setPhase('ok')}
        onError={() => {
          if (failGen < 4) {
            setFailGen((g) => g + 1);
            setPhase('loading');
          } else {
            setPhase('err');
          }
        }}
        className={cn(
          'h-full w-full object-cover transition duration-500 ease-out will-change-[filter,transform,opacity]',
          phase === 'loading' ? 'scale-105 blur-lg opacity-60' : 'scale-100 blur-0 opacity-100',
          imgClassName
        )}
      />
    </div>
  );
}
