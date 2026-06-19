import { Outlet } from 'react-router-dom';
import { useAppContext } from '@/context/useAppContext';
import { cn } from '@/lib/utils';
import { BottomNav } from './BottomNav';

export function AppShell() {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <div
      className={cn(
        'relative mx-auto min-h-dvh w-dvw max-w-[430px] overflow-x-hidden md:max-w-[768px] lg:max-w-[960px]',
        light ? 'ql-soft-surface text-zinc-900' : 'ql-soft-surface text-white'
      )}
    >
      <main className="min-h-dvh">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
