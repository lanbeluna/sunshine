import { motion } from 'framer-motion';
import { Bot, Compass, Map, Sparkles, User } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/useAppContext';
import { cn } from '@/lib/utils';

const tabClass =
  'ql-focus flex min-h-14 flex-1 flex-col items-center justify-end gap-0.5 rounded-2xl pb-1.5 pt-2 text-[11px] font-medium transition-colors duration-150 active:scale-[0.96]';

function TabIcon({
  to,
  label,
  Icon,
  inactiveClass,
  isActive,
}: {
  to: string;
  label: string;
  Icon: typeof Sparkles;
  inactiveClass: string;
  /** Custom active-state check, e.g. /trip/:id should still highlight Trips. */
  isActive?: (pathname: string) => boolean;
}) {
  const { pathname } = useLocation();
  const on = isActive ? isActive(pathname) : pathname === to;

  return (
    <NavLink to={to} className={cn(tabClass, on ? 'text-wander-brand' : inactiveClass)}>
      <motion.span
        key={to + pathname}
        animate={on ? { scale: [1, 1.12, 1] } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
        className={on ? 'animate-wander-tab-glow' : ''}
      >
        <Icon className="h-5 w-5" strokeWidth={on ? 2.25 : 2} />
      </motion.span>
      <span>{label}</span>
    </NavLink>
  );
}

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme } = useAppContext();
  const light = theme === 'light';
  const inactiveTab = light ? 'text-zinc-500' : 'text-wander-secondary';

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-1/2 z-50 w-dvw max-w-[430px] -translate-x-1/2 safe-bottom backdrop-blur-xl md:max-w-[768px] lg:max-w-[960px]',
        light ? 'border-t border-zinc-200/90 bg-white/85' : 'border-t border-white/10 bg-black/80'
      )}
      aria-label="主导航"
    >
      <div className="relative mx-auto flex w-full max-w-[430px] items-end justify-between px-2 pb-1 pt-1 md:max-w-[560px]">
        <TabIcon to="/decision" label="灵感" Icon={Sparkles} inactiveClass={inactiveTab} />
        <TabIcon to="/explore" label="探索" Icon={Compass} inactiveClass={inactiveTab} />
        <div className="w-[4.25rem] shrink-0" aria-hidden />
        <TabIcon
          to="/trips"
          label="行程"
          Icon={Map}
          inactiveClass={inactiveTab}
          isActive={(p) => p === '/trips' || p.startsWith('/trip/')}
        />
        <TabIcon
          to="/profile"
          label="我的"
          Icon={User}
          inactiveClass={inactiveTab}
          isActive={(p) => p === '/profile' || p.startsWith('/profile/')}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-5 flex-col items-center">
          <div className="pointer-events-auto flex flex-col items-center">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <span
                className="pointer-events-none absolute inset-[-6px] rounded-full border border-indigo-400/35 animate-wander-assistant-halo-outer"
                aria-hidden
              />
              <span
                className="pointer-events-none absolute inset-[-2px] rounded-full border-2 border-indigo-400/45 animate-wander-assistant-halo"
                aria-hidden
              />
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-wander-brand via-wander-violet to-wander-lilac opacity-35 blur-md"
                animate={{ scale: [1, 1.08, 1], opacity: [0.24, 0.4, 0.24] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <button
                type="button"
                onClick={() => navigate('/assistant')}
                className={cn(
                  'relative z-[1] flex h-14 w-14 items-center justify-center rounded-full',
                  'ql-focus bg-gradient-to-br from-wander-coral via-rose-500 to-orange-400 text-white shadow-wander-glow',
                  'duration-150 transition-transform active:scale-[0.96]'
                )}
                aria-label="AI助手"
              >
                <Bot className="h-6 w-6" strokeWidth={2.2} />
              </button>
            </div>
            <span
              className={cn(
                'mt-0.5 text-[10px] font-bold leading-none',
                pathname === '/assistant' ? 'text-indigo-500' : light ? 'text-zinc-600' : 'text-wander-secondary'
              )}
            >
              AI助手
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

