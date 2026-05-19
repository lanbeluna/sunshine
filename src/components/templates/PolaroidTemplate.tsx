import { pickCover } from '@/lib/unsplashPools';
import { getStickerEmoji, getWeatherEmoji } from './templateUtils';

export interface PolaroidTemplateProps {
  imageUrl?: string;
  caption: string;
  date: string;
  location?: string;
  stickers: string[];
  weather?: string;
}

export function PolaroidTemplate({
  imageUrl,
  caption,
  date,
  location,
  stickers,
  weather,
}: PolaroidTemplateProps) {
  const weatherIcon = getWeatherEmoji(weather);
  const photoSrc =
    imageUrl?.trim() ? imageUrl.trim() : pickCover(`polaroid-tpl-${caption}-${date}`, 960, 720);

  return (
    <div className="relative inline-block max-w-full -rotate-1 rounded-lg bg-white p-3 pb-8 shadow-warm">
      {weatherIcon ? (
        <div
          className="absolute top-2 right-2 z-10 text-lg leading-none drop-shadow-[0_1px_2px_rgba(139,125,107,0.35)]"
          title={weather}
          aria-hidden
        >
          {weatherIcon}
        </div>
      ) : null}

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-paperDark">
        <img src={photoSrc} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="mt-3 space-y-1 text-center">
        <p className="font-hand text-lg text-ink">{caption}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-2 font-script text-sm text-inkLight">
          <span>{date}</span>
          {location ? (
            <>
              <span aria-hidden>·</span>
              <span>{location}</span>
            </>
          ) : null}
        </div>
      </div>

      {stickers.length > 0 ? (
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-2xl leading-none">
          {stickers.map((s) => (
            <span key={s} title={s}>
              {getStickerEmoji(s)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
