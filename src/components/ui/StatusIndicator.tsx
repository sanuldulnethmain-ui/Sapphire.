import { cn } from '@/lib/utils';

type Tone = 'ready' | 'processing' | 'degraded' | 'offline' | 'standby' | 'active' | 'error';

const tones: Record<Tone, { dot: string; text: string; bg: string }> = {
  ready: { dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-500/10' },
  processing: { dot: 'bg-sapphire-400 animate-pulse-soft', text: 'text-sapphire-300', bg: 'bg-sapphire-500/10' },
  degraded: { dot: 'bg-amber-400', text: 'text-amber-300', bg: 'bg-amber-500/10' },
  offline: { dot: 'bg-slate-500', text: 'text-slate-400', bg: 'bg-slate-500/10' },
  standby: { dot: 'bg-aqua-400', text: 'text-aqua-300', bg: 'bg-aqua-500/10' },
  active: { dot: 'bg-sapphire-400 animate-pulse-soft', text: 'text-sapphire-300', bg: 'bg-sapphire-500/10' },
  error: { dot: 'bg-red-400', text: 'text-red-300', bg: 'bg-red-500/10' },
};

export function StatusIndicator({
  status,
  label,
  size = 'md',
  className,
}: {
  status: Tone;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const tone = tones[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/8 px-2.5 py-0.5',
        tone.bg,
        className
      )}
    >
      <span className={cn('rounded-full', tone.dot, size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')} />
      {label && (
        <span className={cn('text-2xs font-medium uppercase tracking-wider', tone.text)}>
          {label}
        </span>
      )}
    </span>
  );
}
