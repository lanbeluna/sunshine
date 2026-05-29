import { Pencil } from 'lucide-react';
import { toast } from '@/lib/toast';
import { WanderImage } from '@/components/media/WanderImage';
import { useAppContext } from '@/context/AppContext';
import { pickPortrait } from '@/lib/unsplashPools';
import { cn } from '@/lib/utils';

const STATS = [
  { label: '去过', value: '12', unit: '个城市' },
  { label: '收藏', value: '48', unit: '个目的地' },
  { label: '决策', value: '26', unit: '次' },
];

const AVATAR = pickPortrait('ql-profile-hero', 320);

export function ProfileHero() {
  const { theme } = useAppContext();
  const light = theme === 'light';
  const waveFill = light ? '#f4f4f5' : '#0b0b0e';

  return (
    <section className="relative px-4 pb-2">
      <div className="relative overflow-hidden rounded-b-[2rem] ql-photo-shadow">
        <div className="h-44 bg-gradient-to-br from-wander-coral/80 via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_26%),radial-gradient(circle_at_78%_18%,rgba(56,189,248,0.22),transparent_22%)]" />
        <svg className="absolute bottom-0 left-0 h-8 w-full" viewBox="0 0 400 32" preserveAspectRatio="none" aria-hidden>
          <path fill={waveFill} d="M0,16 C80,0 160,28 200,18 C240,8 320,4 400,20 L400,32 L0,32 Z" />
        </svg>
      </div>

      <div
        className={cn(
          'relative z-[1] -mt-14 mx-auto max-w-sm rounded-[1.5rem] border px-4 pb-5 pt-12 shadow-lg',
          light
            ? 'border-zinc-200/80 bg-white text-zinc-900 shadow-zinc-300/40'
            : 'border-white/10 bg-[#17171A]/95 text-white shadow-black/20'
        )}
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div
              className={cn(
                'h-20 w-20 overflow-hidden rounded-full border-[3px] border-white shadow-xl ring-2 ring-wander-coral/25',
                light ? 'bg-zinc-100' : 'bg-gradient-to-br from-wander-surface to-wander-card'
              )}
            >
              <WanderImage
                src={AVATAR}
                alt="用户头像"
                fallbackLabel="旅"
                className="h-full w-full"
                width={160}
                height={160}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                toast.info('编辑资料', { description: '演示：可更换头像、昵称与签名；保存后顶部信息区即时更新。' })
              }
              className="ql-focus absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-wander-card bg-wander-coral text-white shadow-md transition-transform active:scale-95"
              aria-label="编辑头像"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-2 text-center">
          <h2 className={cn('text-lg font-bold', light ? 'text-zinc-900' : 'text-white')}>旅行家小A</h2>
          <p className={cn('mt-0.5 text-xs', light ? 'text-zinc-500' : 'text-white/40')}>@ql_lightrip</p>
          <p
            className={cn(
              'mx-auto mt-2 max-w-[280px] text-sm leading-relaxed',
              light ? 'text-zinc-600' : 'text-white/65'
            )}
          >
            轻旅随行，灵感即达
          </p>
        </div>

        <div
          className={cn(
            'mt-5 grid grid-cols-3 gap-2 border-t pt-4 text-center',
            light ? 'border-zinc-200' : 'border-white/10'
          )}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className={cn('border-r last:border-r-0', light ? 'border-zinc-200' : 'border-white/10')}
            >
              <p className={cn('text-[10px] font-medium uppercase tracking-wider', light ? 'text-zinc-500' : 'text-wander-muted')}>
                {s.label}
              </p>
              <p className={cn('mt-1 text-lg font-bold leading-tight', light ? 'text-zinc-900' : 'text-white')}>
                {s.value}
                <span className={cn('text-xs font-normal', light ? 'text-zinc-600' : 'text-wander-secondary')}>
                  {' '}
                  {s.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
