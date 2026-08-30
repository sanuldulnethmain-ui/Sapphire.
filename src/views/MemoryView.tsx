import { useState, useMemo } from 'react';
import {
  Brain,
  Search,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  Star,
  Shield,
  Clock,
} from 'lucide-react';
import { PageTransition, PageContainer, PageHeader, DevStateBadge } from '@/components/layout/PageShell';
import { Card, CardBody, Badge, Button, Input, Textarea, Label, Modal, EmptyState } from '@/components/ui';
import { cn, formatRelativeTime, formatDate, uid } from '@/lib/utils';
import { memories as initialMemories, sapphireStatus } from '@/lib/data';
import type { Memory, MemoryCategory, MemoryConsentMode } from '@/types';

const CATEGORY_LABELS: Record<MemoryCategory, string> = {
  identity: 'Identity',
  preferences: 'Preferences',
  goals: 'Goals',
  projects: 'Projects',
  interests: 'Interests',
  experiences: 'Experiences',
  lessons: 'Lessons',
};

const CATEGORY_TONES: Record<MemoryCategory, 'sapphire' | 'aqua' | 'success' | 'warning' | 'default' | 'neutral'> = {
  identity: 'sapphire',
  preferences: 'aqua',
  goals: 'success',
  projects: 'sapphire',
  interests: 'warning',
  experiences: 'default',
  lessons: 'neutral',
};

export function MemoryView() {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MemoryCategory | 'all'>('all');
  const [editing, setEditing] = useState<Memory | null>(null);
  const [creating, setCreating] = useState(false);
  const [consentMode, setConsentMode] = useState<MemoryConsentMode>('ask-before-remembering');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return memories.filter((m) => {
      if (activeCategory !== 'all' && m.category !== activeCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.content.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [memories, activeCategory, search]);

  const categoryCounts = useMemo(() => {
    const counts = {} as Record<MemoryCategory, number>;
    memories.forEach((m) => {
      counts[m.category] = (counts[m.category] ?? 0) + 1;
    });
    return counts;
  }, [memories]);

  const handleSave = (mem: Memory) => {
    setMemories((prev) => {
      const exists = prev.find((m) => m.id === mem.id);
      if (exists) return prev.map((m) => (m.id === mem.id ? mem : m));
      return [mem, ...prev];
    });
    setEditing(null);
    setCreating(false);
  };

  const handleDelete = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setMenuOpen(null);
  };

  const handleToggleImportant = (id: string) => {
    setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, important: !m.important } : m)));
    setMenuOpen(null);
  };

  return (
    <PageContainer>
      <PageTransition>
        <PageHeader
          title="Sapphire Memory"
          subtitle="What Sapphire remembers to better understand you."
          icon={<Brain size={20} />}
          action={
            <Button variant="primary" size="md" onClick={() => setCreating(true)}>
              <Plus size={16} /> Add memory
            </Button>
          }
        />

        {!sapphireStatus.memoryConnected && (
          <div className="mb-5">
            <DevStateBadge label="Development Mode — Memory not yet persistent" />
          </div>
        )}

        {/* Search */}
        <div className="mb-5">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Sapphire Memory..."
              className="h-12 w-full rounded-2xl bg-ink-300/40 border border-white/8 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-sapphire-500/30 focus:ring-2 focus:ring-sapphire-500/15 outline-none transition-all"
            />
          </div>
        </div>

        {/* Category filter + consent */}
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <div>
            {/* Category chips */}
            <div className="mb-4 flex flex-wrap gap-2">
              <CategoryChip
                label="All"
                count={memories.length}
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
              />
              {(Object.keys(CATEGORY_LABELS) as MemoryCategory[]).map((cat) => (
                <CategoryChip
                  key={cat}
                  label={CATEGORY_LABELS[cat]}
                  count={categoryCounts[cat] ?? 0}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </div>

            {/* Memory cards */}
            {filtered.length === 0 ? (
              <EmptyState
                icon={<Brain size={28} />}
                title="Sapphire hasn't learned anything here yet."
                description="Start conversations and decide what is worth remembering. Sapphire will remember what matters to better understand you over time."
                action={
                  <Button variant="primary" onClick={() => setCreating(true)}>
                    <Plus size={16} /> Add your first memory
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {filtered.map((mem) => (
                  <MemoryCard
                    key={mem.id}
                    memory={mem}
                    onEdit={() => setEditing(mem)}
                    onDelete={() => handleDelete(mem.id)}
                    onToggleImportant={() => handleToggleImportant(mem.id)}
                    menuOpen={menuOpen === mem.id}
                    onMenuToggle={() => setMenuOpen(menuOpen === mem.id ? null : mem.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Consent controls sidebar */}
          <div className="space-y-4">
            <Card>
              <CardBody className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={16} className="text-sapphire-400" />
                  <h3 className="text-sm font-semibold text-white">Memory Controls</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  You decide what Sapphire remembers. Memory exists to improve your experience — never for surveillance.
                </p>
                <div className="space-y-2">
                  <ConsentOption
                    label="Remember automatically"
                    description="Sapphire saves useful information from conversations."
                    active={consentMode === 'remember-automatically'}
                    onClick={() => setConsentMode('remember-automatically')}
                  />
                  <ConsentOption
                    label="Ask before remembering"
                    description="Sapphire asks before saving new memories."
                    active={consentMode === 'ask-before-remembering'}
                    onClick={() => setConsentMode('ask-before-remembering')}
                  />
                  <ConsentOption
                    label="Never remember"
                    description="Sapphire will not save any new memories."
                    active={consentMode === 'never-remember'}
                    onClick={() => setConsentMode('never-remember')}
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Trash2 size={14} /> Forget this memory
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors">
                    <Trash2 size={14} /> Forget everything
                  </button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </PageTransition>

      {/* Edit/Create modal */}
      {(editing || creating) && (
        <MemoryEditor
          memory={editing}
          onSave={handleSave}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </PageContainer>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
        active
          ? 'bg-sapphire-500/10 border-sapphire-500/25 text-sapphire-200'
          : 'bg-ink-300/30 border-white/5 text-slate-400 hover:text-white hover:border-white/15'
      )}
    >
      {label}
      <span className={cn('text-2xs', active ? 'text-sapphire-400' : 'text-slate-600')}>{count}</span>
    </button>
  );
}

function MemoryCard({
  memory,
  onEdit,
  onDelete,
  onToggleImportant,
  menuOpen,
  onMenuToggle,
}: {
  memory: Memory;
  onEdit: () => void;
  onDelete: () => void;
  onToggleImportant: () => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  return (
    <Card hover={false} className="group transition-all hover:border-white/10">
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={CATEGORY_TONES[memory.category]}>{CATEGORY_LABELS[memory.category]}</Badge>
            {memory.important && (
              <Badge tone="warning">
                <Star size={10} className="fill-current" /> Important
              </Badge>
            )}
            <span className="text-2xs text-slate-600">Confidence {Math.round(memory.confidence * 100)}%</span>
          </div>
          <div className="relative">
            <button
              onClick={onMenuToggle}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={onMenuToggle} />
                <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl glass-strong shadow-glow-lg p-1.5 animate-fade-in-scale">
                  <MenuItem icon={Edit3} label="Edit" onClick={() => { onEdit(); onMenuToggle(); }} />
                  <MenuItem icon={Star} label={memory.important ? 'Unmark important' : 'Mark important'} onClick={onToggleImportant} />
                  <MenuItem icon={Trash2} label="Delete" onClick={onDelete} danger />
                </div>
              </>
            )}
          </div>
        </div>
        <h3 className="text-sm font-semibold text-white mb-1.5">{memory.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{memory.content}</p>
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-2xs text-slate-600">
          <span className="flex items-center gap-1.5">
            Source: <span className="text-slate-500">{memory.source}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={10} /> Updated {formatRelativeTime(memory.updatedAt)}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Edit3;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
        danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:bg-white/5 hover:text-white'
      )}
    >
      <Icon size={14} /> {label}
    </button>
  );
}

function ConsentOption({
  label,
  description,
  active,
  onClick,
}: {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-1 rounded-xl border p-3 text-left transition-all',
        active
          ? 'bg-sapphire-500/10 border-sapphire-500/25'
          : 'bg-ink-300/30 border-white/5 hover:border-white/10'
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors',
            active ? 'border-sapphire-400 bg-sapphire-400' : 'border-slate-600'
          )}
        >
          {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
        </span>
        <span className={cn('text-xs font-medium', active ? 'text-white' : 'text-slate-300')}>{label}</span>
      </div>
      <p className="text-2xs text-slate-500 pl-6">{description}</p>
    </button>
  );
}

function MemoryEditor({
  memory,
  onSave,
  onClose,
}: {
  memory: Memory | null;
  onSave: (m: Memory) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(memory?.title ?? '');
  const [content, setContent] = useState(memory?.content ?? '');
  const [category, setCategory] = useState<MemoryCategory>(memory?.category ?? 'identity');
  const [source, setSource] = useState(memory?.source ?? 'Manual');
  const [important, setImportant] = useState(memory?.important ?? false);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({
      id: memory?.id ?? uid('mem'),
      category,
      title: title.trim(),
      content: content.trim(),
      source,
      confidence: memory?.confidence ?? 0.8,
      important,
      createdAt: memory?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={memory ? 'Edit Memory' : 'Add Memory'}
      subtitle="Sapphire will use this to better understand you."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!title.trim() || !content.trim()}>
            Save memory
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What should Sapphire remember?" />
        </div>
        <div>
          <Label>Content</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="The details Sapphire should know..."
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MemoryCategory)}
              className="h-10 w-full rounded-xl bg-ink-300/60 border border-white/8 px-3 text-sm text-white outline-none focus:border-sapphire-500/50"
            >
              {(Object.keys(CATEGORY_LABELS) as MemoryCategory[]).map((cat) => (
                <option key={cat} value={cat} className="bg-ink-400">{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Source</Label>
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Where from?" />
          </div>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <button
            type="button"
            onClick={() => setImportant(!important)}
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors',
              important ? 'border-amber-400 bg-amber-400/20 text-amber-300' : 'border-slate-600'
            )}
          >
            {important && <Star size={12} className="fill-current" />}
          </button>
          <span className="text-sm text-slate-300">Mark as important</span>
        </label>
      </div>
    </Modal>
  );
}
