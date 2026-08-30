import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'default' | 'sapphire' | 'aqua' | 'success' | 'warning' | 'error' | 'neutral';

const tones: Record<Tone, string> = {
  default: 'bg-white/5 text-slate-300 border-white/10',
  sapphire: 'bg-sapphire-500/10 text-sapphire-300 border-sapphire-500/20',
  aqua: 'bg-aqua-500/10 text-aqua-300 border-aqua-500/20',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  error: 'bg-red-500/10 text-red-300 border-red-500/20',
  neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export function Badge({
  children,
  tone = 'default',
  className,
  dot = false,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-2xs font-medium uppercase tracking-wider',
        tones[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
