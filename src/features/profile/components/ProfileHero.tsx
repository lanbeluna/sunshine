import { Pencil, Sparkles } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Tag } from '@/components/common/Tag';
import { WanderImage } from '@/components/media/WanderImage';
import { toast } from '@/lib/toast';
import { pickPortrait } from '@/lib/unsplashPools';

const AVATAR = pickPortrait('ql-profile-hero', 320);

const STATS = [
  { label: '灵感', value: '12' },
  { label: '草稿', value: '8' },
  { label: '收藏', value: '26' },
];

export function ProfileHero() {
  return (
    <section className="px-4 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))]">
      <Card className="relative overflow-hidden pb-5 pt-20 text-center">
        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-[var(--ql-accent)] via-[var(--ql-accent-3)] to-[var(--ql-accent-2)] opacity-90"
          aria-hidden
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_22%_20%,rgba(255,255,255,0.38),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.22),transparent_22%)]" />

        <div className="relative mx-auto h-24 w-24">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
            <WanderImage
              src={AVATAR}
              alt="用户头像"
              fallbackLabel="QL"
              className="h-full w-full"
              width={180}
              height={180}
            />
          </div>
          <button
            type="button"
            onClick={() => toast.info('资料编辑为课程演示功能')}
            className="ql-focus absolute bottom-1 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[var(--ql-accent)] text-white shadow-lg active:scale-95"
            aria-label="编辑资料"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        <h2 className="mt-3 text-xl font-black tracking-tight text-[var(--ql-ink)]">旅行家小 A</h2>
        <p className="mt-1 text-xs font-semibold text-[var(--ql-muted)]">@ql_lightrip</p>
        <div className="mt-3 flex justify-center">
          <Tag icon={<Sparkles className="h-3.5 w-3.5" />}>轻量旅行灵感工具 · 学生作品</Tag>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {STATS.map((item) => (
            <div key={item.label} className="rounded-2xl bg-[var(--ql-soft)] px-3 py-2">
              <p className="text-lg font-black text-[var(--ql-ink)]">{item.value}</p>
              <p className="text-[11px] font-semibold text-[var(--ql-muted)]">{item.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
