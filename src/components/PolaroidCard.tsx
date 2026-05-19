import type { ReactNode } from 'react';
import { pickCover } from '@/lib/unsplashPools';
import { cn } from '@/lib/utils';

export interface PolaroidCardProps {
  imageUrl?: string;
  /** 无图时在封面显示渐变底 + 首字符（如地点名首字） */
  coverLetter?: string;
  title: string;
  subtitle?: string;
  /** 右上角邮戳式印章文案，如「92%匹配」 */
  stamp?: string;
  /** 拍立得相纸下方的附加内容（如路线图、标签） */
  children?: ReactNode;
  className?: string;
}

export function PolaroidCard({
  imageUrl,
  coverLetter,
  title,
  subtitle,
  stamp,
  children,
  className,
}: PolaroidCardProps) {
  return (
    <article
      className={cn(
        'group relative flex w-full max-w-sm flex-col rounded-[12px] border border-pencil-line bg-white',
        'p-5 pb-6',
        'shadow-[0_4px_14px_var(--shadow-warm)]',
        'animate-polaroid-enter',
        'transition-[transform,box-shadow] duration-300 ease-out',
        'hover:-translate-y-1 hover:rotate-[1deg] hover:shadow-[0_12px_28px_rgba(139,125,107,0.28)]',
        className
      )}
    >
      {stamp ? (
        <div
          className={cn(
            'absolute right-3 top-3 z-10 flex h-16 w-16 -rotate-12 select-none items-center justify-center',
            'rounded-full border border-dashed border-ink/35 bg-white/90',
            'px-1 text-center font-serif text-[10px] font-semibold leading-tight text-ink',
            'shadow-[0_2px_8px_rgba(139,125,107,0.12)]'
          )}
          aria-hidden
        >
          {stamp}
        </div>
      ) : null}

      <div
        className={cn(
          'relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-paper-dark',
          'ring-1 ring-pencil-line/80'
        )}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : coverLetter ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-mint/45 via-butter/35 to-sky/45 font-hand text-4xl font-bold text-ink/75">
            {coverLetter.slice(0, 1)}
          </div>
        ) : (
          <img
            src={pickCover(`polaroid-card-${title}`, 800, 600)}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <h3 className="mt-4 text-center font-hand text-xl font-bold leading-snug text-ink">
        {title}
      </h3>
      {subtitle ? (
        <p className="mt-1 text-center font-serif text-sm text-ink-light">
          {subtitle}
        </p>
      ) : null}
      {children ? <div className="mt-4 w-full px-0.5">{children}</div> : null}
    </article>
  );
}

export default PolaroidCard;
