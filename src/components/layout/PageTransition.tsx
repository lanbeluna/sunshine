import type { Variants } from 'framer-motion';

/**
 * 手账本内栈动画（书架 / 浏览 / 编辑）。
 * 须作为 `<AnimatePresence>` 的**直接子节点**使用，例如：
 * `<motion.div key={booksStack} custom={dir} variants={booksStackVariants} ... />`
 */
export const booksStackVariants: Variants = {
  initial: (dir: number) => ({
    x: dir >= 0 ? '100%' : '-28%',
    opacity: dir >= 0 ? 1 : 0.88,
  }),
  animate: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir >= 0 ? '-28%' : '100%',
    opacity: dir >= 0 ? 0.88 : 1,
  }),
};

export const booksStackTransition = {
  duration: 0.34,
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
};
