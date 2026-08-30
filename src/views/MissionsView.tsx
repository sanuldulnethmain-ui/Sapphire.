import { useState } from 'react';
import {
  Rocket,
  Plus,
  Brain,
  ClipboardList,
  Wrench,
  Eye,
  ShieldCheck,
  FileCheck,
  GraduationCap,
  ChevronRight,
  Cpu,
} from 'lucide-react';
import { PageTransition, PageContainer, PageHeader, DevStateBadge } from '@/components/layout/PageShell';
import { Card, CardHeader, CardBody, Badge, Button, Progress, StatusIndicator, EmptyState } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import { missions as initialMissions, agents } from '@/lib/data';
import type { Mission, MissionPhase, MissionStep, AgentType } from '@/types';

const PHASE_ICONS: Record<MissionPhase, typeof Brain> = {
  understand: Brain,
  plan: ClipboardList,
  execute: Wrench,
  review: Eye,
  approve: ShieldCheck,
  report: FileCheck,
  learn: GraduationCap,
};

const PHASE_LABELS: Record<MissionPhase, string> = {
  understand: 'Understand',
  plan: 'Plan',
  execute: 'Execute',
  review: 'Review',
  approve: 'Approve',
  report: 'Report',
  learn: 'Learn',
};

const STEP_STATUS_TONES = {
  pending: 'neutral' as const,
  running: 'sapphire' as const,
  complete: 'success' as const,
  failed: 'error' as const,
  'awaiting-approval': 'warning' as const,
};

const AGENT_ICONS: Partial<Record<AgentType, typeof Brain>> = {
  conversation: Brain,
  planning: ClipboardList,
  creator: Wrench,
  research: Brain,
  computer: Cpu,
};

export function MissionsView() {
  const [missions] = useState<Mission[]>(initialMissions);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = missions.find((m) => m.id === selectedId);

  if (selected) {
    return <MissionDetail mission={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <PageContainer>
      <PageTransition>
        <PageHeader
          title="Mission Control"
          subtitle="Sapphire coordinates agents and tools to accomplish larger objectives."
          icon={<Rocket size={20} />}
          action={
            <Button variant="primary">
              <Plus size={16} /> New mission
            </Button>
          }
        />

        <div className="mb-5">
          <DevStateBadge label="Prototype — Agents and tools not yet connected" />
        </div>

        {/* Architecture flow */}
        <Card className="mb-5">
          <CardBody className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Mission Architecture</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              {['Goal', 'Mission', 'Tasks', 'Agents', 'Tools', 'Results'].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-lg border border-white/8 bg-ink-300/40 px-3 py-1.5 font-medium text-slate-300">{step}</span>
                  {i < arr.length - 1 && <ChevronRight size={14} className="text-slate-600" />}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              A mission represents a larger task Sapphire coordinates. Sapphire understands the objective, creates a plan, assigns agents, uses tools, reviews results, asks for approval when necessary, executes, reports, and learns.
            </p>
          </CardBody>
        </Card>

        {missions.length === 0 ? (
          <EmptyState
            icon={<Rocket size={28} />}
            title="No missions yet."
            description="Missions are larger objectives that Sapphire coordinates using agents and tools. Start one when you have a goal that needs multiple steps."
            action={<Button variant="primary"><Plus size={16} /> Start a mission</Button>}
          />
        ) : (
          <div className="space-y-4">
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} onClick={() => setSelectedId(mission.id)} />
            ))}
          </div>
        )}
      </PageTransition>
    </PageContainer>
  );
}

function MissionCard({ mission, onClick }: { mission: Mission; onClick: () => void }) {
  const completedSteps = mission.steps.filter((s) => s.status === 'complete').length;
  const progress = Math.round((completedSteps / mission.steps.length) * 100);
  const runningStep = mission.steps.find((s) => s.status === 'running');

  return (
    <Card hover onClick={onClick} className="group">
      <CardBody className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white group-hover:text-sapphire-200 transition-colors">{mission.title}</h3>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed line-clamp-2">{mission.description}</p>
          </div>
          <StatusIndicator
            status={mission.status === 'planning' ? 'standby' : mission.status === 'in-progress' ? 'processing' : mission.status === 'completed' ? 'ready' : mission.status === 'awaiting-approval' ? 'degraded' : 'error'}
            label={mission.status.replace('-', ' ')}
          />
        </div>

        {runningStep && (
          <div className="mb-3 rounded-xl bg-sapphire-500/5 border border-sapphire-500/15 p-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sapphire-400 animate-pulse-soft" />
              <span className="text-xs text-sapphire-300 font-medium">{runningStep.label}</span>
            </div>
          </div>
        )}

        <div className="mb-3">
          <div className="flex items-center justify-between text-2xs text-slate-500 mb-1.5">
            <span>{completedSteps}/{mission.steps.length} steps complete</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} size="sm" />
        </div>

        <div className="flex items-center justify-between text-2xs text-slate-600">
          <span>Updated {formatRelativeTime(mission.updatedAt)}</span>
          <span className="text-sapphire-300 group-hover:translate-x-0.5 transition-transform">View details →</span>
        </div>
      </CardBody>
    </Card>
  );
}

function MissionDetail({ mission, onBack }: { mission: Mission; onBack: () => void }) {
  return (
    <PageContainer>
      <PageTransition>
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ChevronRight size={16} className="rotate-180" /> Back to missions
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">{mission.title}</h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">{mission.description}</p>
          <div className="mt-3">
            <StatusIndicator
              status={mission.status === 'planning' ? 'standby' : mission.status === 'in-progress' ? 'processing' : 'ready'}
              label={mission.status.replace('-', ' ')}
            />
          </div>
        </div>

        {/* Mission flow */}
        <Card className="mb-5">
          <CardHeader title="Mission Flow" subtitle="Sapphire's coordination pipeline" />
          <CardBody className="p-5 pt-0">
            <div className="space-y-1">
              {mission.steps.map((step, i) => (
                <MissionStepRow key={step.id} step={step} isLast={i === mission.steps.length - 1} />
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Assigned agents */}
        <Card>
          <CardHeader title="Available Agents" subtitle="Agents Sapphire can assign to this mission" />
          <CardBody className="grid gap-3 sm:grid-cols-2">
            {agents.filter((a) => a.status !== 'offline' || a.type === 'conversation').slice(0, 6).map((agent) => {
              const Icon = AGENT_ICONS[agent.type] ?? Cpu;
              return (
                <div key={agent.id} className="rounded-xl border border-white/5 bg-ink-300/30 p-3.5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/5">
                      <Icon size={16} className="text-sapphire-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{agent.name}</p>
                      <p className="text-2xs text-slate-500 capitalize">{agent.type.replace('-', ' ')}</p>
                    </div>
                    <StatusIndicator status={agent.status === 'standby' ? 'standby' : agent.status === 'active' ? 'active' : 'offline'} size="sm" />
                  </div>
                  <p className="text-2xs text-slate-500 leading-relaxed">{agent.description}</p>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </PageTransition>
    </PageContainer>
  );
}

function MissionStepRow({ step, isLast }: { step: MissionStep; isLast: boolean }) {
  const Icon = PHASE_ICONS[step.phase];
  const tone = STEP_STATUS_TONES[step.status];

  return (
    <div className="flex gap-3.5 group">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl border transition-all',
            step.status === 'complete' && 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
            step.status === 'running' && 'bg-sapphire-500/10 border-sapphire-500/25 text-sapphire-300',
            step.status === 'pending' && 'bg-ink-300/40 border-white/5 text-slate-500',
            step.status === 'awaiting-approval' && 'bg-amber-500/10 border-amber-500/20 text-amber-300',
            step.status === 'failed' && 'bg-red-500/10 border-red-500/20 text-red-300'
          )}
        >
          {step.status === 'running' ? (
            <span className="h-3 w-3 rounded-full border-2 border-sapphire-400 border-t-transparent animate-spin" />
          ) : (
            <Icon size={16} />
          )}
        </div>
        {!isLast && (
          <div className={cn(
            'w-px flex-1 my-1',
            step.status === 'complete' ? 'bg-emerald-500/20' : 'bg-white/5'
          )} />
        )}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-600">{PHASE_LABELS[step.phase]}</span>
          <Badge tone={tone} dot>{step.status.replace('-', ' ')}</Badge>
        </div>
        <p className={cn(
          'text-sm font-medium',
          step.status === 'complete' ? 'text-slate-400' : 'text-white'
        )}>
          {step.label}
        </p>
        {step.detail && (
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.detail}</p>
        )}
      </div>
    </div>
  );
}
