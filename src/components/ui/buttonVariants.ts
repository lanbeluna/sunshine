import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium font-serif transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-mint/40 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-mint text-ink hover:bg-mint/85 shadow-warm',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/25',
        outline:
          'border-2 border-dashed border-pencil bg-transparent text-ink hover:bg-paper-dark/80 shadow-none',
        secondary:
          'bg-paper-dark text-ink hover:bg-paper-dark/90 border border-pencil-line/80',
        ghost:
          'hover:bg-paper-dark/70 hover:text-ink text-ink',
        link: 'text-mint underline-offset-4 hover:underline shadow-none',
      },
      size: {
        default: 'h-10 px-5 py-2 has-[>svg]:px-4',
        sm: 'h-9 rounded-xl gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-11 rounded-xl px-6 has-[>svg]:px-4',
        icon: 'size-10 rounded-xl',
        'icon-sm': 'size-9 rounded-xl',
        'icon-lg': 'size-11 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
