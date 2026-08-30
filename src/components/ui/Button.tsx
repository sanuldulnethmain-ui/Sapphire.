import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-sapphire-600 text-white hover:bg-sapphire-500 shadow-glow-sm hover:shadow-glow border border-sapphire-400/30',
  secondary:
    'bg-ink-300/80 text-slate-200 hover:bg-ink-400 border border-white/8',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
  danger:
    'bg-red-500/90 text-white hover:bg-red-500 border border-red-400/30',
  outline:
    'border border-white/10 text-slate-200 hover:bg-white/5 hover:border-white/20',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-6 text-sm rounded-xl gap-2',
  icon: 'h-9 w-9 rounded-lg justify-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out-expo disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] whitespace-nowrap',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
