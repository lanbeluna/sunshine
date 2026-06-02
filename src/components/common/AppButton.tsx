import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
};

const variants: Record<Variant, string> = {
  primary:
    'border-transparent bg-gradient-to-r from-[var(--ql-accent)] via-rose-400 to-orange-300 text-white shadow-lg shadow-rose-500/20 hover:brightness-105',
  secondary:
    'border-sky-300/30 bg-sky-400/12 text-sky-50 hover:bg-sky-400/18',
  soft:
    'border-[var(--ql-card-border)] bg-[var(--ql-soft)] text-white hover:bg-white/[0.12]',
  ghost:
    'border-transparent bg-transparent text-wander-secondary hover:bg-white/[0.08] hover:text-white',
  danger:
    'border-red-400/25 bg-red-500/10 text-red-200 hover:bg-red-500/16',
};

const sizes: Record<Size, string> = {
  sm: 'min-h-9 rounded-xl px-3 text-xs',
  md: 'min-h-11 rounded-2xl px-4 text-sm',
  lg: 'min-h-12 rounded-2xl px-5 text-sm',
  icon: 'h-11 w-11 rounded-2xl p-0',
};

export function AppButton({
  className,
  variant = 'primary',
  size = 'md',
  icon,
  children,
  type = 'button',
  ...props
}: AppButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'ql-focus inline-flex items-center justify-center gap-2 border font-semibold transition-[background,color,filter,transform,box-shadow] active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </button>
  );
}
