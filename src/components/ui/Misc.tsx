import { cn } from '@/lib/utils';

export function Tooltip({
  content,
  children,
  side = 'top',
}: {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  return (
    <span className="relative group/tt inline-flex">
      {children}
      <span
        className={cn(
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-ink-600 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg border border-white/10 transition-opacity duration-200 group-hover/tt:opacity-100',
          positions[side]
        )}
      >
        {content}
      </span>
    </span>
  );
}

export function Avatar({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base' };
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-sapphire-500/30 to-aqua-500/20 border border-white/10 font-semibold text-white',
        sizes[size],
        className
      )}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-white/5', className)} />;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('shimmer animate-shimmer rounded-lg bg-white/5', className)} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/8 text-slate-500">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
