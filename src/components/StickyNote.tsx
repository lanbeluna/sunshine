import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export type StickyNoteColor = 'yellow' | 'pink' | 'blue' | 'green';

export interface StickyNoteProps {
  color?: StickyNoteColor;
  children: React.ReactNode;
  /** 为 true 时在右上角显示折叠角（::after） */
  foldedCorner?: boolean;
  className?: string;
}

const stickyBg: Record<StickyNoteColor, string> = {
  yellow: 'bg-[#FFF3B0]',
  pink: 'bg-[#FFD6E0]',
  blue: 'bg-[#D6E4FF]',
  green: 'bg-[#D4F1D4]',
};

/** 折叠三角斜边颜色（略深于背景） */
const stickyFoldTop: Record<StickyNoteColor, string> = {
  yellow: 'after:border-t-[#E8D78A]',
  pink: 'after:border-t-[#E8B8C8]',
  blue: 'after:border-t-[#B8C8E8]',
  green: 'after:border-t-[#B8D8B8]',
};

const TILT_CLASSES = ['rotate-[-2deg]', 'rotate-[2deg]'] as const;

export function StickyNote({
  color = 'yellow',
  children,
  foldedCorner = true,
  className,
}: StickyNoteProps) {
  const tilt = useMemo(
    () => TILT_CLASSES[color.length % 2],
    [color]
  );

  return (
    <div
      className={cn(
        'relative min-w-[200px] overflow-hidden p-5 font-serif text-ink',
        'shadow-[0_6px_20px_rgba(139,125,107,0.18),0_2px_6px_rgba(139,125,107,0.1)]',
        stickyBg[color],
        tilt,
        foldedCorner &&
          cn(
            'after:pointer-events-none after:absolute after:right-0 after:top-0',
            'after:h-0 after:w-0 after:border-solid after:border-l-[26px] after:border-t-[26px]',
            'after:border-l-transparent after:content-[\'\']',
            stickyFoldTop[color]
          ),
        className
      )}
    >
      {children}
    </div>
  );
}

export default StickyNote;
