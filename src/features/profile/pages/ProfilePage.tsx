import { useMemo, useState } from 'react';
import { Loader2, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MenuRowButton } from '@/features/profile/components/MenuRowButton';
import { MenuRowSwitch } from '@/features/profile/components/MenuRowSwitch';
import { MenuSection } from '@/features/profile/components/MenuSection';
import { ProfileHero } from '@/features/profile/components/ProfileHero';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAppContext } from '@/context/useAppContext';
import { useAuth } from '@/features/auth/context/useAuth';
import { clearUserLocalData } from '@/lib/profileStorageKeys';
import { loadCollections } from '@/lib/collectionsStore';
import { loadCustomTrips } from '@/lib/tripsStorage';
import { loadDraftNotes } from '@/lib/notesStore';

function estimateStorageSize(): string {
  if (typeof window === 'undefined') return '-';
  let bytes = 0;
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key) ?? '';
    bytes += key.length + value.length;
  }
  const mb = bytes / (1024 * 1024);
  if (mb < 0.01) return '<0.1 MB';
  return `${mb.toFixed(1)} MB`;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { theme, setTheme, language } = useAppContext();
  const { user, signOut } = useAuth();
  const [cacheLabel] = useState(() => estimateStorageSize());
  const [clearOpen, setClearOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const savedOverview = useMemo(() => {
    const collections = loadCollections();
    return {
      destinations: collections.destinations.length,
      trips: loadCustomTrips().length,
      drafts: loadDraftNotes().length,
    };
  }, []);

  const langLabel = language === 'zh' ? '中文' : 'English';

  const runClearCache = () => {
    clearUserLocalData();
    toast.success('本地演示数据已清除');
    setClearOpen(false);
    window.location.reload();
  };

  const runLogout = async () => {
    setLoggingOut(true);
    const result = await signOut();
    setLoggingOut(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    clearUserLocalData();
    setLogoutOpen(false);
    toast.success('已退出登录');
    navigate('/login', { replace: true });
  };

  return (
    <PageContainer>
      <ProfileHero email={user?.email} />

      <div className="space-y-6 px-4 pb-10 pt-3">
        <section className="grid grid-cols-3 gap-2" aria-label="保存概览">
          <OverviewButton label="收藏灵感" value={savedOverview.destinations} onClick={() => navigate('/profile/collections')} />
          <OverviewButton label="行程草稿" value={savedOverview.trips} onClick={() => navigate('/trips')} />
          <OverviewButton label="手记草稿" value={savedOverview.drafts} onClick={() => navigate('/profile/drafts')} />
        </section>

        <MenuSection title="账号状态">
          <MenuRowButton
            icon={<span className="text-lg leading-none">✓</span>}
            title="Supabase Auth 已登录"
            subtitle={user?.email ?? '当前账号已通过 Supabase 会话保护'}
            onClick={() => undefined}
            noDivider
          />
        </MenuSection>

        <MenuSection title="旅行偏好">
          <MenuRowButton
            icon={<span className="text-lg leading-none">★</span>}
            title="我的偏好标签"
            subtitle="预算范围、旅行风格、饮食偏好等"
            onClick={() => navigate('/profile/preferences')}
          />
          <MenuRowButton
            icon={<span className="text-lg leading-none">🎯</span>}
            title="决策历史"
            subtitle="历次旅行灵感推荐记录"
            onClick={() => navigate('/profile/decision-history')}
            noDivider
          />
        </MenuSection>

        <MenuSection title="内容管理">
          <MenuRowButton
            icon={<span className="text-lg leading-none">♡</span>}
            title="我的收藏"
            subtitle="收藏的目的地和旅行灵感"
            onClick={() => navigate('/profile/collections')}
          />
          <MenuRowButton
            icon={<span className="text-lg leading-none">📝</span>}
            title="我的笔记"
            subtitle="你发布或保存的旅行记录"
            onClick={() => navigate('/profile/notes')}
          />
          <MenuRowButton
            icon={<span className="text-lg leading-none">✎</span>}
            title="草稿箱"
            subtitle="还没整理完的手记草稿"
            onClick={() => navigate('/profile/drafts')}
            noDivider
          />
        </MenuSection>

        <MenuSection title="应用设置">
          <MenuRowButton
            icon={<span className="text-lg leading-none">🔔</span>}
            title="通知设置"
            subtitle="行程提醒、推荐与系统通知"
            onClick={() => navigate('/profile/notifications')}
          />
          <MenuRowSwitch
            icon={<Moon className="h-5 w-5" />}
            title="深色模式"
            checked={theme === 'dark'}
            onCheckedChange={(on) => {
              setTheme(on ? 'dark' : 'light');
              toast.success(on ? '已开启深色模式' : '已切换为浅色模式');
            }}
          />
          <MenuRowButton
            icon={<span className="text-lg leading-none">🌐</span>}
            title="语言切换"
            onClick={() => navigate('/profile/language')}
            trailing={<span className="text-xs font-semibold text-wander-brand">{langLabel}</span>}
          />
          <MenuRowButton
            icon={<span className="text-lg leading-none">⌫</span>}
            title="清除本地演示数据"
            onClick={() => setClearOpen(true)}
            trailing={<span className="text-xs text-wander-muted">{cacheLabel}</span>}
          />
          <MenuRowButton
            icon={<span className="text-lg leading-none">ℹ</span>}
            title="关于我们"
            onClick={() => navigate('/profile/about')}
          />
          <MenuRowButton
            icon={<span className="text-lg leading-none">§</span>}
            title="用户协议与隐私政策"
            onClick={() => navigate('/profile/legal')}
            noDivider
          />
        </MenuSection>

        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="ql-focus w-full rounded-full border border-red-500/20 bg-red-500/10 py-3.5 text-center text-sm font-semibold text-red-300 transition-colors active:bg-red-500/10"
        >
          退出登录
        </button>
      </div>

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent className="border-white/10 bg-wander-card text-white sm:max-w-md [&_svg]:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">清除本地演示数据</AlertDialogTitle>
            <AlertDialogDescription className="!text-wander-secondary">
              这会清除收藏、草稿、通知等本地演示数据，但不会退出当前 Supabase 账号。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/15 bg-transparent text-wander-secondary">取消</AlertDialogCancel>
            <AlertDialogAction onClick={runClearCache} className="bg-rose-600 text-white hover:bg-rose-500">
              确认清除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent className="border-white/10 bg-wander-card text-white sm:max-w-md [&_svg]:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">退出登录</AlertDialogTitle>
            <AlertDialogDescription className="!text-wander-secondary">
              退出后需要重新登录才能访问个人页、收藏和草稿。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/15 bg-transparent text-wander-secondary" disabled={loggingOut}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={runLogout} className="bg-rose-600 text-white hover:bg-rose-500" disabled={loggingOut}>
              {loggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              确认退出
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}

function OverviewButton({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ql-focus rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3 text-left transition-colors active:bg-white/[0.08]"
    >
      <span className="block text-lg font-bold text-white">{value}</span>
      <span className="mt-1 block text-[11px] font-medium text-wander-secondary">{label}</span>
    </button>
  );
}
