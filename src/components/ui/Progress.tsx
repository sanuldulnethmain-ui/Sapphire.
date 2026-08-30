import { cn } from '@/lib/utils';

export function Progress({
  value,
  className,
  tone = 'sapphire',
  size = 'md',
}: {
  value: number;
  className?: string;
  tone?: 'sapphire' | 'aqua' | 'emerald';
  size?: 'sm' | 'md';
}) {
  const tones = {
    sapphire: 'from-sapphire-500 to-sapphire-400',
    aqua: 'from-aqua-500 to-aqua-400',
    emerald: 'from-emerald-500 to-emerald-400',
  };
  return (
    <div
      className={cn(
        'w-full rounded-full bg-ink-400/60 overflow-hidden',
        size === 'sm' ? 'h-1' : 'h-1.5',
        className
      )}
    >
      <div
        className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out-expo', tones[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
