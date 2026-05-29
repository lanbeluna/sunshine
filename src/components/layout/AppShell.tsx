import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { BottomNav } from './BottomNav';

export function AppShell() {
  const location = useLocation();
  const { theme } = useAppContext();
  const light = theme === 'light';

  const pushLike = /^\/(destination|trip|messages)(\/|$)/.test(location.pathname);

  return (
    <div
      className={cn(
        'relative mx-auto min-h-dvh w-dvw max-w-[430px] overflow-x-hidden',
        light ? 'bg-zinc-100 text-zinc-900' : 'ql-app-surface text-white'
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={location.pathname}
          initial={pushLike ? { x: '100%', opacity: 1 } : { opacity: 0, x: 16 }}
          animate={{ x: 0, opacity: 1 }}
          exit={pushLike ? { x: '100%', opacity: 0.92 } : { opacity: 0, x: -12 }}
          transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-dvh"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
