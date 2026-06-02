import { toast } from '@/lib/toast';
import { ProfileSubPageLayout } from '@/features/profile/components/ProfileSubPageLayout';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export default function PreferencesPage() {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <ProfileSubPageLayout title="我的偏好标签">
      <div className={cn('space-y-4 px-4 py-6 text-sm leading-relaxed', light ? 'text-zinc-700' : 'text-wander-secondary')}>
        <p>
          在此可设置预算档位、旅行节奏、饮食忌口与无障碍需求等信息，用于影响 AI 决策权重。当前为演示占位页，保存功能将以 Toast 提示代替。
        </p>
        <button
          type="button"
          onClick={() => toast.success('已保存（演示）', { description: '偏好将参与后续问答与推荐权重计算。' })}
          className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold text-white shadow-lg shadow-indigo-500/25"
        >
          保存偏好
        </button>
      </div>
    </ProfileSubPageLayout>
  );
}
