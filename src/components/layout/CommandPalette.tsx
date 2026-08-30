import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  MessageSquare,
  Brain,
  FolderKanban,
  Target,
  Rocket,
  Home,
  Settings,
  CornerDownLeft,
  Command,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppView } from '@/types';

interface CommandAction {
  id: string;
  label: string;
  hint: string;
  icon: typeof Search;
  view: AppView;
  group: string;
}

const actions: CommandAction[] = [
  { id: 'home', label: 'Go to Home', hint: 'Command Center', icon: Home, view: 'home', group: 'Navigate' },
  { id: 'conv', label: 'Start a conversation', hint: 'Conversation', icon: MessageSquare, view: 'conversation', group: 'Actions' },
  { id: 'mem', label: 'Search memory', hint: 'Memory Center', icon: Brain, view: 'memory', group: 'Actions' },
  { id: 'proj', label: 'Open projects', hint: 'Projects', icon: FolderKanban, view: 'projects', group: 'Navigate' },
  { id: 'goals', label: 'Review goals', hint: 'Goals', icon: Target, view: 'goals', group: 'Actions' },
  { id: 'mis', label: 'Open mission control', hint: 'Missions', icon: Rocket, view: 'missions', group: 'Navigate' },
  { id: 'settings', label: 'Open settings', hint: 'Settings', icon: Settings, view: 'settings', group: 'Navigate' },
];

export function CommandPalette({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (v: AppView) => void;
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandAction[]>();
    filtered.forEach((a) => {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group)!.push(a);
    });
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const action = filtered[active];
        if (action) {
          onNavigate(action.view);
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, filtered, active, onClose, onNavigate]);

  if (!open) return null;

  let flatIndex = -1;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
      <div className="absolute inset-0 bg-ink-0/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl glass-strong rounded-2xl shadow-glow-lg animate-fade-in-scale overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
          <Search size={18} className="text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or ask Sapphire..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          />
          <kbd className="flex items-center gap-0.5 rounded-md bg-white/5 px-1.5 py-0.5 text-2xs text-slate-500 border border-white/5">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {grouped.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No results for "{query}"
            </div>
          ) : (
            grouped.map(([group, items]) => (
              <div key={group} className="mb-1">
                <div className="px-3 py-1.5 text-2xs font-medium uppercase tracking-wider text-slate-600">
                  {group}
                </div>
                {items.map((action) => {
                  flatIndex++;
                  const idx = flatIndex;
                  const Icon = action.icon;
                  const isActive = idx === active;
                  return (
                    <button
                      key={action.id}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => {
                        onNavigate(action.view);
                        onClose();
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                        isActive ? 'bg-sapphire-500/10 text-white' : 'text-slate-400 hover:text-white'
                      )}
                    >
                      <Icon size={16} className={cn('shrink-0', isActive && 'text-sapphire-300')} />
                      <span className="flex-1 text-left">{action.label}</span>
                      <span className="text-2xs text-slate-600">{action.hint}</span>
                      {isActive && <CornerDownLeft size={14} className="text-sapphire-400" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5 text-2xs text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white/5 px-1 py-0.5 border border-white/5">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white/5 px-1 py-0.5 border border-white/5">↵</kbd>
              select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Command size={10} /> Sapphire Command
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
