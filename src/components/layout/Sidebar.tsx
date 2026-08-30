import { useState } from 'react';
import { ChevronLeft, ChevronRight, Gem } from 'lucide-react';
import { navItems } from '@/config/navigation';
import { cn } from '@/lib/utils';
import type { AppView } from '@/types';

const GROUP_LABELS: Record<string, string> = {
  main: 'Sapphire',
  workspace: 'Workspace',
  system: 'System',
};

export function Sidebar({
  view,
  onNavigate,
  collapsed,
  onToggleCollapse,
}: {
  view: AppView;
  onNavigate: (v: AppView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const groups = ['main', 'workspace', 'system'] as const;

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-white/5 bg-ink-100/40 backdrop-blur-xl transition-all duration-300 ease-out-expo z-30',
        collapsed ? 'w-[68px]' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-white/5 shrink-0">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sapphire-500/20 to-aqua-500/10 border border-sapphire-400/20" />
          <Gem size={18} className="text-sapphire-300 relative" />
        </div>
        {!collapsed && (
          <div className="min-w-0 animate-fade-in">
            <div className="text-sm font-semibold text-white tracking-tight">Sapphire</div>
            <div className="text-2xs text-slate-500 uppercase tracking-wider">Founder Edition</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-none py-3 px-2 space-y-5">
        {groups.map((group) => {
          const items = navItems.filter((i) => i.group === group);
          return (
            <div key={group} className="space-y-0.5">
              {!collapsed && (
                <div className="px-3 pb-1.5 text-2xs font-medium uppercase tracking-wider text-slate-600">
                  {GROUP_LABELS[group]}
                </div>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
                      active
                        ? 'text-white bg-sapphire-500/10 border border-sapphire-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent',
                      collapsed && 'justify-center px-0'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-sapphire-400" />
                    )}
                    <Icon
                      size={18}
                      className={cn('shrink-0 transition-colors', active && 'text-sapphire-300')}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-white/5 p-2 shrink-0">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

export function MobileNav({
  view,
  onNavigate,
}: {
  view: AppView;
  onNavigate: (v: AppView) => void;
}) {
  const [open, setOpen] = useState(false);
  const groups = ['main', 'workspace', 'system'] as const;

  return (
    <>
      {/* Mobile bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/8 bg-ink-100/90 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems
            .filter((i) => ['home', 'conversation', 'memory', 'projects'].includes(i.id))
            .map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-2xs font-medium transition-colors',
                    active ? 'text-sapphire-300' : 'text-slate-500'
                  )}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-2xs font-medium text-slate-500"
          >
            <div className="flex h-5 w-5 items-center justify-center">
              <div className="flex flex-col gap-1">
                <span className="h-0.5 w-4 bg-current rounded-full" />
                <span className="h-0.5 w-4 bg-current rounded-full" />
              </div>
            </div>
            More
          </button>
        </div>
      </div>

      {/* Mobile full nav drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-ink-0/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-ink-200/95 backdrop-blur-xl border-l border-white/8 p-4 animate-slide-in-right overflow-y-auto">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sapphire-500/20 to-aqua-500/10 border border-sapphire-400/20">
                <Gem size={18} className="text-sapphire-300" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Sapphire</div>
                <div className="text-2xs text-slate-500 uppercase tracking-wider">Founder Edition</div>
              </div>
            </div>
            {groups.map((group) => {
              const items = navItems.filter((i) => i.group === group);
              return (
                <div key={group} className="mb-4">
                  <div className="px-3 pb-1.5 text-2xs font-medium uppercase tracking-wider text-slate-600">
                    {GROUP_LABELS[group]}
                  </div>
                  {items.map((item) => {
                    const Icon = item.icon;
                    const active = view === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setOpen(false);
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                          active
                            ? 'text-white bg-sapphire-500/10 border border-sapphire-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        )}
                      >
                        <Icon size={18} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
