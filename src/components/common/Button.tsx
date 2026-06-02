import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
  fullWidth?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[var(--ql-accent)] to-[var(--ql-accent-2)] text-white shadow-lg shadow-rose-500/20 hover:brightness-105',
  secondary:
    'border border-[var(--ql-card-border)] bg-[var(--ql-soft)] text-[var(--ql-ink)] hover:bg-white/20',
  ghost: 'text-[var(--ql-muted)] hover:bg-white/10 hover:text-[var(--ql-ink)]',
  danger: 'border border-rose-400/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15',
};

export function Button({
  variant = 'primary',
  icon,
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'ql-focus inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-[transform,filter,background-color,color,opacity] active:scale-[0.97]',
        'disabled:pointer-events-none disabled:opacity-45',
        fullWidth && 'w-full',
        variantClass[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
