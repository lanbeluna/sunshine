import { BookOpen, Compass, HeartHandshake } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Tag } from '@/components/common/Tag';
import { useAppContext } from '@/context/AppContext';

function timeSubtitle(): string {
  const h = new Date().getHours();
  if (h >= 5 && h <= 11) return '早安，先从今天的旅行心情开始。';
  if (h >= 12 && h <= 17) return '下午好，把零散灵感整理成一条路线。';
  if (h >= 18 && h <= 23) return '晚上好，适合计划一场轻松的小旅行。';
  return '夜深了，先存一份明天可以继续看的灵感。';
}

export function WelcomeBlock() {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <div className="px-4 pb-2 pt-2">
      <Card className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[var(--ql-accent)]/20 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-[var(--ql-accent-2)]/20 blur-2xl"
          aria-hidden
        />
        <div className="relative">
          <Tag icon={<Compass className="h-3.5 w-3.5" />}>Travel inspiration, not booking</Tag>
          <h1 className="mt-4 text-[2rem] font-black leading-[1.05] tracking-tight text-[var(--ql-ink)]">
            QL轻旅
            <span className="block text-[var(--ql-accent)]">帮你找到下一站灵感</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ql-muted)]">{timeSubtitle()}</p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { icon: HeartHandshake, label: '输入偏好' },
              { icon: Compass, label: '生成推荐' },
              { icon: BookOpen, label: '保存草稿' },
            ].map((item) => (
              <div
                key={item.label}
                className={light ? 'rounded-2xl bg-white/70 p-3' : 'rounded-2xl bg-white/[0.06] p-3'}
              >
                <item.icon className="h-4 w-4 text-[var(--ql-accent)]" />
                <p className="mt-2 text-[11px] font-bold text-[var(--ql-ink)]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
