import { motion } from 'framer-motion';
import { toast } from '@/lib/toast';
import { Link } from 'react-router-dom';

export function TripEmptyState() {
  return (
    <div className="ql-card mx-4 mt-2 flex flex-col items-center rounded-[1.5rem] px-8 pb-8 pt-7 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6 w-full max-w-[200px]"
      >
        <svg viewBox="0 0 200 160" className="w-full text-wander-coral/85" aria-hidden>
          <defs>
            <linearGradient id="trip-empty-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF435B" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
          </defs>
          <rect x="40" y="48" width="120" height="88" rx="14" fill="#1A1A1A" stroke="url(#trip-empty-grad)" strokeWidth="2" />
          <path
            d="M70 48V38c0-6 5-11 11-11h38c6 0 11 5 11 11v10"
            fill="none"
            stroke="url(#trip-empty-grad)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="100" cy="92" r="18" fill="url(#trip-empty-grad)" opacity="0.35" />
          <path
            d="M88 118h24M100 100v18"
            stroke="url(#trip-empty-grad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M56 72h8M136 72h8M56 100h8M136 100h8" stroke="#52525B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
      <p className="max-w-[260px] text-sm leading-relaxed text-white/65">还没有行程哦，去灵感页生成一个吧</p>
      <Link
        to="/decision"
        onClick={() => toast.success('前往灵感', { description: '用问答或盲盒生成你的下一段行程灵感。' })}
        className="ql-focus mt-6 flex h-12 w-full max-w-xs items-center justify-center rounded-full bg-gradient-to-r from-wander-coral to-orange-400 font-semibold text-white shadow-lg shadow-rose-500/25 transition-transform active:scale-[0.98]"
      >
        去决策
      </Link>
    </div>
  );
}
