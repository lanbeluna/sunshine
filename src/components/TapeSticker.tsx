import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

export type TapeStickerColor = 'mint' | 'coral' | 'butter' | 'sky' | 'lavender';

export interface TapeStickerProps {
  color?: TapeStickerColor;
  /** 覆盖默认的随机 ±3°；会钳制到 [-3, 3] 并取整，对应 Tailwind 旋转类 */
  rotation?: number;
  children?: React.ReactNode;
  className?: string;
}

/** 供 Tailwind JIT 扫描的完整类名（勿改为模板字符串拼接） */
const ROTATION_CLASSES = [
  'rotate-[-3deg]',
  'rotate-[-2deg]',
  'rotate-[-1deg]',
  'rotate-[0deg]',
  'rotate-[1deg]',
  'rotate-[2deg]',
  'rotate-[3deg]',
] as const;

function clampRotationDeg(value: number): number {
  return Math.max(-3, Math.min(3, Math.round(value)));
}

function rotationClass(deg: number): (typeof ROTATION_CLASSES)[number] {
  const i = clampRotationDeg(deg) + 3;
  return ROTATION_CLASSES[i];
}

function randomDefaultRotationClass(): (typeof ROTATION_CLASSES)[number] {
  const idx = Math.floor(Math.random() * ROTATION_CLASSES.length);
  return ROTATION_CLASSES[idx];
}

const tapeColorClass: Record<TapeStickerColor, string> = {
  mint: 'bg-mint/60',
  coral: 'bg-coral/60',
  butter: 'bg-butter/60',
  sky: 'bg-sky/60',
  lavender: 'bg-lavender/60',
};

export function TapeSticker({
  color = 'mint',
  rotation,
  children,
  className,
}: TapeStickerProps) {
  const [defaultRotate] = useState(randomDefaultRotationClass);
  const rotateCls = useMemo(
    () => (rotation !== undefined ? rotationClass(rotation) : defaultRotate),
    [rotation, defaultRotate]
  );

  return (
    <span
      className={cn(
        'inline-flex h-7 items-center justify-center rounded-full px-3 font-script text-sm font-semibold text-ink',
        'shadow-[0_2px_5px_rgba(139,125,107,0.22),0_-1px_0_rgba(255,255,255,0.35)_inset]',
        tapeColorClass[color],
        rotateCls,
        className
      )}
    >
      {children}
    </span>
  );
}

export default TapeSticker;

/*
使用示例：

import { TapeSticker } from '@/components/TapeSticker';

<div className="relative rounded-xl border border-pencil-line bg-white p-6 pt-10 shadow-warm">
  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
    <TapeSticker color="coral">New!</TapeSticker>
  </div>
  <p>卡片内容……</p>
</div>

<TapeSticker color="lavender" rotation={-2}>推荐</TapeSticker>
*/
