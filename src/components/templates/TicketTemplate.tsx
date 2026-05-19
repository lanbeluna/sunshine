import { pickCover } from '@/lib/unsplashPools';

export interface TicketTemplateProps {
  imageUrl?: string;
  caption: string;
  date: string;
  location?: string;
}

function TicketTopZigzag() {
  const w = 200;
  const tooth = 8;
  const teeth = 12;
  const step = w / teeth;
  let d = `M0,${tooth}`;
  for (let i = 0; i < teeth; i++) {
    const x = i * step;
    d += ` L${x + step / 2},0 L${x + step},${tooth}`;
  }
  d += ` L${w},${tooth} L${w},${tooth + 2} L0,${tooth + 2} Z`;
  return (
    <svg
      className="block w-full text-butter/20"
      viewBox={`0 0 ${w} ${tooth + 2}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
}

function BarcodeStrip() {
  const bars = Array.from({ length: 20 }, (_, i) => i % 2 === 0);
  return (
    <div className="flex h-10 w-full max-w-[200px] items-stretch justify-center gap-0 overflow-hidden rounded-sm border border-ink/10 bg-white px-1 py-1">
      {bars.map((dark, i) => (
        <div
          key={i}
          className={`w-1 shrink-0 ${dark ? 'bg-ink' : 'bg-transparent'}`}
        />
      ))}
    </div>
  );
}

export function TicketTemplate({
  imageUrl,
  caption,
  date,
  location,
}: TicketTemplateProps) {
  const placeTitle = location?.trim() || '—';
  const photoSrc =
    imageUrl?.trim() ? imageUrl.trim() : pickCover(`ticket-tpl-${caption}-${date}`, 560, 315);

  return (
    <div className="relative inline-block max-w-sm overflow-hidden rounded-b-lg bg-butter/20 shadow-warm">
      <TicketTopZigzag />

      <div className="border-x-2 border-dashed border-ink/15 px-4 pb-4">
        <div className="relative mx-auto aspect-[16/9] w-full max-w-[280px] overflow-hidden rounded-md bg-paperDark">
          <img src={photoSrc} alt="" className="h-full w-full object-cover" />
        </div>

        <p className="mt-3 text-center font-hand text-2xl text-ink">{placeTitle}</p>

        <p className="mt-2 text-center font-serif text-sm text-ink">{caption}</p>

        <div className="mt-4 flex flex-col items-center gap-2 border-t border-dashed border-ink/15 pt-3">
          <BarcodeStrip />
          <p className="font-mono text-xs tabular-nums text-ink">{date}</p>
          <p className="font-mono text-xs tracking-widest text-inkLight">
            BOARDING PASS
          </p>
        </div>
      </div>
    </div>
  );
}
