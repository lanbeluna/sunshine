import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const dots = [0, 1, 2, 3, 4, 5].map((i) => ({
  angle: (i / 6) * Math.PI * 2,
  delay: i * 0.08,
}));

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-y-0 left-1/2 z-[70] flex w-full max-w-[430px] -translate-x-1/2 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-wander-bg via-indigo-950/80 to-wander-bg px-8"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-40"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(167,139,250,0.3), transparent 40%)',
          backgroundSize: '200% 200%',
        }}
      />

      <div className="relative mb-10 flex h-28 w-28 items-center justify-center">
        {dots.map((d) => (
          <motion.span
            key={d.angle}
            className="absolute h-2 w-2 rounded-full bg-indigo-300/90 shadow-lg shadow-indigo-500/50"
            initial={{ x: 0, y: 0, opacity: 0.3, scale: 0.6 }}
            animate={{
              x: [Math.cos(d.angle) * 52, Math.cos(d.angle) * 8],
              y: [Math.sin(d.angle) * 52, Math.sin(d.angle) * 8],
              opacity: [0.9, 0.4],
              scale: [1, 0.35],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: d.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
        <motion.div
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-wander-brand to-wander-lilac shadow-wander-glow-lg"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <MapPin className="h-8 w-8 text-white" />
        </motion.div>
      </div>

      <p className="relative text-center text-base font-medium text-white">AI正在为你计算最优方案...</p>

      <div className="relative mt-8 h-2 w-full max-w-xs overflow-hidden rounded-full bg-wander-surface">
        <motion.div
          className="h-full w-1/3 rounded-full bg-gradient-to-r from-wander-brand via-fuchsia-400 to-wander-lilac"
          animate={{ x: ['-120%', '280%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
