import { Sparkles } from 'lucide-react';
import { ProfileSubPageLayout } from '@/features/profile/components/ProfileSubPageLayout';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <ProfileSubPageLayout title="关于我们">
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
          <Sparkles className="h-10 w-10" />
        </div>
        <h2 className={cn('mt-5 text-2xl font-bold', light ? 'text-zinc-900' : 'text-white')}>QL轻旅</h2>
        <p className="mt-2 text-sm font-medium text-indigo-400">v1.0.0</p>
        <p className={cn('mt-6 max-w-sm text-sm leading-relaxed', light ? 'text-zinc-600' : 'text-wander-secondary')}>
          轻量规划，灵感出发
        </p>
        <p className={cn('mt-8 text-xs', light ? 'text-zinc-500' : 'text-wander-muted')}>开发者信息</p>
        <p className={cn('mt-1 text-sm', light ? 'text-zinc-700' : 'text-wander-secondary')}>课程作业演示</p>
        <p className={cn('mt-6 text-xs', light ? 'text-zinc-500' : 'text-wander-muted')}>联系方式</p>
        <p className={cn('mt-1 text-sm', light ? 'text-zinc-700' : 'text-wander-secondary')}>—</p>
      </div>
    </ProfileSubPageLayout>
  );
}
