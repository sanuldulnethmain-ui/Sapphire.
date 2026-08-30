import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Command,
  Gem,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { notifications } from '@/lib/data';
import { formatRelativeTime } from '@/lib/utils';
import type { AppView } from '@/types';

export function TopBar({
  onOpenCommand,
  onNavigate,
  onOpenNotifications,
  notificationOpen,
}: {
  onOpenCommand: () => void;
  onNavigate: (v: AppView) => void;
  onOpenNotifications: () => void;
  notificationOpen: boolean;
}) {
  const [notifOpen, setNotifOpen] = useState(notificationOpen);
  const notifRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setNotifOpen(notificationOpen);
  }, [notificationOpen]);

  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/5 bg-ink-100/40 backdrop-blur-xl px-4 md:px-6 z-20">
      {/* Left — search trigger */}
      <button
        onClick={onOpenCommand}
        className="group flex items-center gap-3 rounded-xl border border-white/8 bg-ink-300/40 px-3.5 py-2 text-sm text-slate-500 transition-all duration-200 hover:border-white/15 hover:bg-ink-300/60 w-full max-w-xs"
      >
        <Search size={16} className="shrink-0" />
        <span className="truncate flex-1 text-left">Search or ask Sapphire...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 rounded-md bg-white/5 px-1.5 py-0.5 text-2xs text-slate-500 border border-white/5">
          <Command size={10} /> K
        </kbd>
      </button>

      {/* Right — status + notifications + profile */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Sapphire core status */}
        <button
          onClick={() => onNavigate('settings')}
          className="hidden lg:flex items-center gap-2 rounded-full border border-white/8 bg-ink-300/40 px-3 py-1.5 transition-colors hover:bg-ink-300/60"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Sapphire Core · Ready
          </span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-sapphire-400 ring-2 ring-ink-100" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-2xl shadow-glow-lg animate-fade-in-scale overflow-hidden z-50">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unread > 0 && (
                  <span className="text-2xs text-sapphire-300 font-medium">{unread} new</span>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'flex gap-3 p-4 border-b border-white/5 last:border-0 transition-colors hover:bg-white/5',
                      !n.read && 'bg-sapphire-500/5'
                    )}
                  >
                    <div
                      className={cn(
                        'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                        n.read ? 'bg-slate-600' : 'bg-sapphire-400'
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.body}</p>
                      <p className="text-2xs text-slate-600 mt-1.5">{formatRelativeTime(n.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setNotifOpen(false);
                  onNavigate('activity');
                }}
                className="w-full p-3 text-xs font-medium text-sapphire-300 hover:bg-white/5 transition-colors border-t border-white/5"
              >
                View all activity
              </button>
            </div>
          )}
        </div>

        {/* Profile */}
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-ink-300/40 px-2 py-1.5 transition-colors hover:bg-ink-300/60"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sapphire-500/30 to-aqua-500/20 border border-white/10 text-xs font-semibold text-white">
            S
          </div>
          <div className="hidden sm:block text-left pr-1">
            <div className="text-xs font-medium text-white leading-tight">Sanul</div>
            <div className="text-2xs text-slate-500 leading-tight">#000001</div>
          </div>
        </button>
      </div>
    </header>
  );
}

// Re-export Gem for convenience in shell
export { Gem };
