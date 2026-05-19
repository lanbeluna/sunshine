import { pickCover } from '@/lib/unsplashPools';
import { formatDateAbbrev } from './templateUtils';

export interface PostcardTemplateProps {
  imageUrl?: string;
  caption: string;
  date: string;
  location?: string;
}

export function PostcardTemplate({
  imageUrl,
  caption,
  date,
  location,
}: PostcardTemplateProps) {
  const stampEmoji = location ? '✈️' : '🌏';
  const photoSrc =
    imageUrl?.trim() ? imageUrl.trim() : pickCover(`postcard-tpl-${caption}-${date}`, 720, 540);

  return (
    <div className="inline-block max-w-full overflow-hidden rounded-lg bg-paperDark shadow-warm">
      <div className="flex min-h-[200px] w-full max-w-md">
        <div className="w-[60%] shrink-0 p-2">
          <div className="h-full min-h-[180px] overflow-hidden rounded bg-paperDark">
            <img src={photoSrc} alt="" className="h-full min-h-[180px] w-full rounded object-cover" />
          </div>
        </div>

        <div className="relative w-[40%] shrink-0 border-l border-pencil/40 p-3 pr-2">
          <div className="mb-3 space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-px w-full bg-pencil/30" />
            ))}
          </div>

          <p className="font-serif text-sm leading-relaxed text-ink">{caption}</p>

          <div className="absolute right-2 bottom-10">
            <div className="relative">
              <div className="flex h-10 w-8 items-center justify-center border border-pencil bg-white text-lg shadow-stamp">
                {stampEmoji}
              </div>
              <div className="pointer-events-none absolute -top-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-ink/20 bg-white/90 font-script text-[10px] text-ink rotate-12 shadow-stamp">
                {formatDateAbbrev(date)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-pencil/50 bg-pencil/20 px-3 py-1.5 text-center font-script text-xs text-inkLight">
        {location ? `${location} · ${date}` : date}
      </div>
    </div>
  );
}
