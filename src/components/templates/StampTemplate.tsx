import { pickCover } from '@/lib/unsplashPools';
import { formatDateAbbrev } from './templateUtils';

export interface StampTemplateProps {
  imageUrl?: string;
  caption: string;
  date: string;
  location?: string;
}

export function StampTemplate({
  imageUrl,
  caption,
  date,
  location,
}: StampTemplateProps) {
  const photoSrc =
    imageUrl?.trim() ? imageUrl.trim() : pickCover(`stamp-tpl-${caption}-${date}`, 960, 720);
  const postmark = [location, formatDateAbbrev(date)].filter(Boolean).join('\n');
  const denomination =
    caption.trim().length > 0 ? caption.trim().charAt(0).toUpperCase() : '·';

  return (
    <div
      className="relative inline-block max-w-full rounded-sm p-3 shadow-stamp"
      style={{
        background:
          'radial-gradient(circle, transparent 4px, #E8E4D9 4px, #E8E4D9 5px, transparent 5px)',
        backgroundSize: '12px 12px',
      }}
    >
      <div className="relative overflow-hidden rounded-sm bg-card">
        <div className="relative aspect-[4/3] w-full bg-paperDark">
          <img src={photoSrc} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="absolute top-2 right-2 flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-dashed border-coral/60 bg-coral/10 p-1 text-center rotate-12">
          <span className="whitespace-pre-line font-script text-[11px] leading-tight text-coral">
            {postmark || '—'}
          </span>
        </div>

        <div className="border-t border-pencil/40 bg-paperDark/80 px-3 py-2 text-center">
          <p className="font-mono text-xs font-semibold tracking-widest text-ink">
            1 TRIP
          </p>
          <p className="mt-0.5 font-hand text-lg text-ink">{caption}</p>
        </div>

        <div className="flex items-center justify-between border-t-2 border-dashed border-pencil/50 bg-pencil/30 px-3 py-2">
          <span className="font-mono text-xs text-inkLight">{date}</span>
          <span className="font-hand text-2xl font-bold tabular-nums text-ink">
            {denomination}
          </span>
        </div>
      </div>
    </div>
  );
}
