import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-xl bg-ink-300/60 border border-white/8 px-3.5 text-sm text-white placeholder:text-slate-500 transition-all duration-200',
          'focus:border-sapphire-500/50 focus:bg-ink-300/80 focus:ring-2 focus:ring-sapphire-500/20',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-xl bg-ink-300/60 border border-white/8 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all duration-200 resize-none',
          'focus:border-sapphire-500/50 focus:bg-ink-300/80 focus:ring-2 focus:ring-sapphire-500/20',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider', className)}>
      {children}
    </label>
  );
}
