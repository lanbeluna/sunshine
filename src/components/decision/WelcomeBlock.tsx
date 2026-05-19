import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

function timeSubtitle(): string {
  const h = new Date().getHours();
  if (h >= 5 && h <= 11) return '早安，给心情换一片风景吧 ☀️';
  if (h >= 12 && h <= 17) return '下午好，趁阳光正好出发吧 🌤️';
  if (h >= 18 && h <= 23) return '晚上好，计划一场星空下的旅行吧 🌙';
  return '夜深了，做个关于远方的梦吧 ✨';
}

export function WelcomeBlock() {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <div className="mt-2 px-4 pb-1">
      <h2
        className={cn(
          'text-2xl font-bold tracking-tight',
          light ? 'text-zinc-900' : 'text-white'
        )}
      >
        今天想去哪里冒险？
      </h2>
      <p className={cn('mt-1.5 text-sm text-zinc-400', light && 'text-zinc-500')}>{timeSubtitle()}</p>
    </div>
  );
}
