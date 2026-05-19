import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

/** 星空粒子固定布局，避免每次挂载跳动 */
const STARS = [
  { l: 6, t: 10, d: 6.5, del: 0 },
  { l: 18, t: 4, d: 8.2, del: 0.4 },
  { l: 88, t: 8, d: 7.1, del: 1.1 },
  { l: 72, t: 22, d: 5.8, del: 0.2 },
  { l: 52, t: 6, d: 9, del: 0.8 },
  { l: 94, t: 28, d: 6.2, del: 1.5 },
  { l: 4, t: 42, d: 7.4, del: 0.3 },
  { l: 28, t: 38, d: 5.5, del: 2 },
  { l: 78, t: 48, d: 8.8, del: 0.6 },
  { l: 12, t: 58, d: 6.9, del: 1.2 },
  { l: 62, t: 4, d: 7.7, del: 0.9 },
  { l: 44, t: 18, d: 5.2, del: 1.8 },
  { l: 96, t: 14, d: 6.1, del: 0.1 },
  { l: 34, t: 12, d: 8.4, del: 1.4 },
];

/** 城市灯光：相对地球 viewBox 的坐标 */
const CITY_LIGHTS: { cx: number; cy: number; r: number; delay: string }[] = [
  { cx: 78, cy: 92, r: 1.4, delay: '0s' },
  { cx: 102, cy: 88, r: 1.2, delay: '0.3s' },
  { cx: 118, cy: 96, r: 1.5, delay: '0.6s' },
  { cx: 132, cy: 82, r: 1.1, delay: '0.2s' },
  { cx: 148, cy: 94, r: 1.3, delay: '0.9s' },
  { cx: 92, cy: 108, r: 1.2, delay: '0.4s' },
  { cx: 110, cy: 118, r: 1.4, delay: '1.1s' },
  { cx: 128, cy: 112, r: 1, delay: '0.7s' },
  { cx: 86, cy: 124, r: 1.2, delay: '1.3s' },
  { cx: 140, cy: 122, r: 1.3, delay: '0.5s' },
  { cx: 98, cy: 76, r: 1, delay: '1.5s' },
  { cx: 124, cy: 72, r: 1.1, delay: '0.8s' },
  { cx: 72, cy: 104, r: 1.2, delay: '1.7s' },
  { cx: 152, cy: 108, r: 1, delay: '1s' },
  { cx: 104, cy: 132, r: 1.3, delay: '0.15s' },
  { cx: 118, cy: 128, r: 1.1, delay: '1.2s' },
];

export function DecisionEarthHero() {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <div className="relative mx-auto h-full w-full max-h-[192px] max-w-[300px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        {STARS.map((s, i) => (
          <span
            key={i}
            className={cn(
              'absolute h-1 w-1 rounded-full animate-wander-star-drift',
              light ? 'bg-indigo-400/50' : 'bg-white/70'
            )}
            style={{
              left: `${s.l}%`,
              top: `${s.t}%`,
              animationDuration: `${s.d}s`,
              animationDelay: `${s.del}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex h-full max-h-[192px] w-full min-h-[140px] max-w-[280px] items-center justify-center">
        {/* 轨道 + 卫星光点 */}
        <div
          className="pointer-events-none absolute flex items-center justify-center"
          style={{ width: '108%', height: '108%' }}
        >
          <div className="absolute rounded-full border border-indigo-400/25 shadow-[0_0_20px_rgba(99,102,241,0.12)]" style={{ inset: '2%' }} />
          <div
            className="absolute animate-[spin_18s_linear_infinite]"
            style={{ width: '104%', height: '104%', transformOrigin: '50% 50%' }}
          >
            <div
              className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_14px_3px_rgba(165,243,252,0.85),0_0_28px_rgba(139,92,246,0.35)]"
              aria-hidden
            />
          </div>
        </div>

        {/* 地球主体 */}
        <div
          className={cn(
            'relative z-[1] flex aspect-square w-[76%] items-center justify-center rounded-full',
            'border border-indigo-400/35 shadow-[inset_0_0_48px_rgba(99,102,241,0.18),0_0_40px_rgba(79,70,229,0.15)]',
            light ? 'bg-indigo-100/40' : 'bg-[#0c0c14]/90'
          )}
        >
          <div
            className="absolute inset-[3%] overflow-hidden rounded-full"
            style={{ clipPath: 'circle(50% at 50% 50%)' }}
          >
            <div
              className="absolute inset-[-8%] animate-[spin_30s_linear_infinite] will-change-transform"
              style={{ transformOrigin: '50% 50%' }}
            >
              <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
                <defs>
                  <radialGradient id="wander-earth-ocean" cx="32%" cy="28%" r="75%">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.55" />
                    <stop offset="45%" stopColor="#312e81" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                  </radialGradient>
                  <linearGradient id="wander-earth-rim" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
                <circle cx="120" cy="120" r="108" fill="url(#wander-earth-ocean)" />
                {/* 简化的陆块轮廓 */}
                <path
                  d="M52 98c18-22 48-28 78-18 22 8 38 28 42 52-8 14-26 22-44 20-30-4-58-22-76-54z"
                  fill="white"
                  opacity="0.07"
                />
                <path
                  d="M118 64c28 4 52 22 58 48-12 10-32 12-48 4-22-12-34-32-10-52z"
                  fill="white"
                  opacity="0.055"
                />
                <path
                  d="M72 138c14 18 40 28 66 22 20-4 36-18 44-36-16-8-36-6-52 4-18 12-34 28-58 10z"
                  fill="white"
                  opacity="0.06"
                />
                <ellipse cx="120" cy="120" rx="108" ry="108" fill="none" stroke="url(#wander-earth-rim)" strokeWidth="1.2" opacity="0.35" />
                {/* 经纬网格感 */}
                <ellipse cx="120" cy="120" rx="108" ry="36" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="0.6" />
                <ellipse cx="120" cy="120" rx="108" ry="72" fill="none" stroke="white" strokeOpacity="0.035" strokeWidth="0.5" />
                <line x1="12" y1="120" x2="228" y2="120" stroke="white" strokeOpacity="0.04" strokeWidth="0.5" />
                <line x1="120" y1="12" x2="120" y2="228" stroke="white" strokeOpacity="0.04" strokeWidth="0.5" />
                {CITY_LIGHTS.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.cx}
                    cy={p.cy}
                    r={p.r}
                    fill="#e0e7ff"
                    style={{
                      transformOrigin: `${p.cx}px ${p.cy}px`,
                      animation: `wander-city-blink ${2.05 + (i % 5) * 0.38}s ease-in-out infinite alternate`,
                      animationDelay: p.delay,
                    }}
                  />
                ))}
              </svg>
            </div>
          </div>
          {/* 外缘高光 */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/10"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
