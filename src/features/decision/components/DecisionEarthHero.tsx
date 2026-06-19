import { Camera, Cloud, MapPin, Mountain, Ticket } from 'lucide-react';
import { useAppContext } from '@/context/useAppContext';
import { cn } from '@/lib/utils';

const tagClass =
  'rounded-full border border-white/40 bg-white/55 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur-md';

function RouteLine() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-8 bottom-8 h-20 text-white/80 drop-shadow-sm"
      viewBox="0 0 220 82"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 58C48 22 77 74 112 40C145 8 164 38 204 18"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 12"
      />
    </svg>
  );
}

function MainInspirationCard() {
  return (
    <div className="absolute left-1/2 top-6 z-20 w-[188px] -translate-x-1/2 rotate-[-3deg] rounded-[26px] border border-white/55 bg-white/70 p-3.5 shadow-[0_22px_50px_rgba(79,70,229,0.18)] backdrop-blur-xl">
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-sky-200 via-violet-200 to-rose-100 p-3">
        <div className="absolute -right-4 -top-5 h-16 w-16 rounded-full bg-white/50 blur-sm" aria-hidden />
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-black text-violet-700">灵感推荐</span>
          <MapPin className="h-4 w-4 text-sky-600" />
        </div>
        <div className="mt-8">
          <p className="text-[11px] font-bold text-slate-500">杭州</p>
          <h3 className="mt-1 text-lg font-black leading-tight tracking-tight text-slate-950">周末轻旅行</h3>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={tagClass}>2天</span>
        <span className={tagClass}>低预算</span>
        <span className={tagClass}>文艺散步</span>
      </div>
    </div>
  );
}

function SideCards() {
  return (
    <>
      <div className="absolute left-1 top-16 z-10 w-[112px] rotate-[-10deg] rounded-3xl border border-white/45 bg-white/50 p-3 shadow-[0_18px_42px_rgba(14,165,233,0.14)] backdrop-blur-xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-200/80 text-sky-700">
          <Camera className="h-5 w-5" />
        </div>
        <p className="mt-3 text-[11px] font-black text-slate-800">慢拍小巷</p>
        <p className="mt-0.5 text-[10px] font-semibold text-slate-500">咖啡 · 展馆</p>
      </div>

      <div className="absolute right-2 top-20 z-10 w-[118px] rotate-[9deg] rounded-3xl border border-white/45 bg-white/50 p-3 shadow-[0_18px_42px_rgba(168,85,247,0.16)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-200/80 text-violet-700">
            <Ticket className="h-5 w-5" />
          </div>
          <span className="rounded-full bg-white/60 px-2 py-1 text-[10px] font-black text-violet-700">周末</span>
        </div>
        <p className="mt-3 text-[11px] font-black text-slate-800">灵感票夹</p>
        <p className="mt-0.5 text-[10px] font-semibold text-slate-500">可保存</p>
      </div>
    </>
  );
}

export function DecisionEarthHero() {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <div className="relative mx-auto h-full w-full max-h-[210px] max-w-[320px]">
      <div
        className={cn(
          'relative mx-auto h-[196px] w-full overflow-hidden rounded-[34px] border shadow-[0_24px_70px_rgba(99,102,241,0.16)]',
          light
            ? 'border-white/75 bg-gradient-to-br from-violet-100 via-sky-100 to-rose-50'
            : 'border-white/10 bg-gradient-to-br from-indigo-950 via-violet-950 to-sky-950'
        )}
      >
        <div className="absolute -left-10 -top-12 h-36 w-36 rounded-full bg-rose-200/45 blur-3xl" aria-hidden />
        <div className="absolute -right-12 top-4 h-40 w-40 rounded-full bg-sky-300/35 blur-3xl" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/30 to-transparent" aria-hidden />

        <RouteLine />

        <div className="absolute right-8 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/45 bg-white/45 text-sky-600 shadow-sm backdrop-blur-md">
          <Cloud className="h-6 w-6" />
        </div>
        <div className="absolute bottom-5 left-9 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/45 bg-white/45 text-violet-600 shadow-sm backdrop-blur-md">
          <Mountain className="h-5 w-5" />
        </div>
        <div className="absolute bottom-9 right-12 flex h-9 w-9 items-center justify-center rounded-full bg-sky-400 text-white shadow-lg shadow-sky-400/25">
          <MapPin className="h-5 w-5" />
        </div>

        <SideCards />
        <MainInspirationCard />
      </div>
    </div>
  );
}
