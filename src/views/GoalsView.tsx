import { useState } from 'react';
import { Target, Plus, Calendar, CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import { PageTransition, PageContainer, PageHeader, DevStateBadge } from '@/components/layout/PageShell';
import { Card, CardBody, Badge, Button, Progress, EmptyState } from '@/components/ui';
import { cn, formatShortDate, formatRelativeTime } from '@/lib/utils';
import { goals as initialGoals } from '@/lib/data';
import type { Goal, GoalCategory, GoalStatus } from '@/types';

const CATEGORY_TONES: Record<GoalCategory, 'sapphire' | 'aqua' | 'success' | 'warning' | 'default'> = {
  personal: 'aqua',
  learning: 'sapphire',
  business: 'success',
  creative: 'warning',
  technical: 'default',
};

const STATUS_TONES: Record<GoalStatus, 'success' | 'warning' | 'neutral' | 'default'> = {
  active: 'success',
  completed: 'neutral',
  'on-hold': 'warning',
  archived: 'default',
};

const CATEGORIES: (GoalCategory | 'all')[] = ['all', 'personal', 'learning', 'business', 'creative', 'technical'];

export function GoalsView() {
  const [goals] = useState<Goal[]>(initialGoals);
  const [filter, setFilter] = useState<GoalCategory | 'all'>('all');

  const filtered = goals.filter((g) => filter === 'all' || g.category === filter);

  const activeCount = goals.filter((g) => g.status === 'active').length;
  const avgProgress = Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length);

  return (
    <PageContainer>
      <PageTransition>
        <PageHeader
          title="Goals"
          subtitle="What you are working toward. Sapphire helps you stay on track."
          icon={<Target size={20} />}
          action={
            <Button variant="primary">
              <Plus size={16} /> New goal
            </Button>
          }
        />

        <div className="mb-5">
          <DevStateBadge label="Development Mode — Goals not yet persistent" />
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card><CardBody className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{goals.length}</div>
            <div className="text-2xs text-slate-500 uppercase tracking-wider mt-1">Total Goals</div>
          </CardBody></Card>
          <Card><CardBody className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-300">{activeCount}</div>
            <div className="text-2xs text-slate-500 uppercase tracking-wider mt-1">Active</div>
          </CardBody></Card>
          <Card><CardBody className="p-4 text-center">
            <div className="text-2xl font-bold text-sapphire-300">{avgProgress}%</div>
            <div className="text-2xs text-slate-500 uppercase tracking-wider mt-1">Avg Progress</div>
          </CardBody></Card>
        </div>

        {/* Filter */}
        <div className="mb-5 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-all',
                filter === cat
                  ? 'bg-sapphire-500/10 border-sapphire-500/25 text-sapphire-200'
                  : 'bg-ink-300/30 border-white/5 text-slate-400 hover:text-white hover:border-white/15'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Target size={28} />}
            title="No goals in this category yet."
            description="Define what you want to achieve. Sapphire will help you break it down into milestones and track your progress."
            action={<Button variant="primary"><Plus size={16} /> Create goal</Button>}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </PageTransition>
    </PageContainer>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const completedMilestones = goal.milestones.filter((m) => m.done).length;
  return (
    <Card hover={false} className="group transition-all hover:border-white/10">
      <CardBody className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white">{goal.title}</h3>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed line-clamp-2">{goal.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge tone={CATEGORY_TONES[goal.category]}>{goal.category}</Badge>
          <Badge tone={STATUS_TONES[goal.status]} dot>{goal.status}</Badge>
          {goal.deadline && (
            <span className="flex items-center gap-1 text-2xs text-slate-500">
              <Calendar size={11} /> {formatShortDate(goal.deadline)}
            </span>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-2xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1"><TrendingUp size={11} /> {completedMilestones}/{goal.milestones.length} milestones</span>
            <span>{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} size="sm" tone={goal.progress === 100 ? 'emerald' : 'sapphire'} />
        </div>

        {/* Milestones */}
        <div className="space-y-1 pt-3 border-t border-white/5">
          {goal.milestones.map((ms) => (
            <div key={ms.id} className="flex items-center gap-2.5 rounded-lg p-1.5">
              {ms.done ? (
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              ) : (
                <Circle size={15} className="text-slate-600 shrink-0" />
              )}
              <span className={cn(
                'text-xs',
                ms.done ? 'text-slate-500 line-through' : 'text-slate-300'
              )}>
                {ms.title}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
