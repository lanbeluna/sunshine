import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/toast';
import { ProfileSubPageLayout } from '@/components/profile/ProfileSubPageLayout';
import { useAppContext, type AppLanguage } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export default function LanguagePage() {
  const navigate = useNavigate();
  const { language, setLanguage, theme } = useAppContext();
  const light = theme === 'light';

  const pick = (lang: AppLanguage) => {
    setLanguage(lang);
    navigate(-1);
    toast.success(lang === 'zh' ? '已切换为中文' : 'Switched to English', {
      description: '当前为界面语言演示，正文未做完整翻译。',
    });
  };

  return (
    <ProfileSubPageLayout title="语言设置">
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={() => pick('zh')}
          className={cn(
            'flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition',
            language === 'zh'
              ? 'border-indigo-500/50 bg-indigo-500/15'
              : light
                ? 'border-zinc-200 bg-white'
                : 'border-white/10 bg-wander-card'
          )}
        >
          <span className={cn('font-semibold', light ? 'text-zinc-900' : 'text-white')}>中文</span>
          {language === 'zh' ? <span className="text-xs font-medium text-indigo-400">默认</span> : null}
        </button>
        <button
          type="button"
          onClick={() => pick('en')}
          className={cn(
            'mt-3 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition',
            language === 'en'
              ? 'border-indigo-500/50 bg-indigo-500/15'
              : light
                ? 'border-zinc-200 bg-white'
                : 'border-white/10 bg-wander-card'
          )}
        >
          <span className={cn('font-semibold', light ? 'text-zinc-900' : 'text-white')}>English</span>
          {language === 'en' ? <span className="text-xs font-medium text-indigo-400">Selected</span> : null}
        </button>
      </div>
    </ProfileSubPageLayout>
  );
}
