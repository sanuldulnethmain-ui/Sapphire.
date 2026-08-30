import { useState } from 'react';
import {
  FolderKanban,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Calendar,
  Target,
  FileText,
  MessageSquare,
  Activity,
} from 'lucide-react';
import { PageTransition, PageContainer, PageHeader, DevStateBadge } from '@/components/layout/PageShell';
import { Card, CardHeader, CardBody, Badge, Button, Progress, EmptyState } from '@/components/ui';
import { cn, formatRelativeTime, formatShortDate } from '@/lib/utils';
import { projects as initialProjects, conversations, memories, activityEvents } from '@/lib/data';
import type { Project, ProjectStatus, ProjectPriority } from '@/types';

const STATUS_TONES: Record<ProjectStatus, 'success' | 'sapphire' | 'warning' | 'neutral' | 'default'> = {
  active: 'success',
  planning: 'sapphire',
  'on-hold': 'warning',
  completed: 'neutral',
  archived: 'default',
};

const PRIORITY_TONES: Record<ProjectPriority, 'error' | 'warning' | 'default' | 'neutral'> = {
  critical: 'error',
  high: 'warning',
  medium: 'default',
  low: 'neutral',
};

export function ProjectsView() {
  const [projects] = useState<Project[]>(initialProjects);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = projects.find((p) => p.id === selectedId);

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <PageContainer>
      <PageTransition>
        <PageHeader
          title="Projects"
          subtitle="Your ongoing work and what Sapphire is helping you build."
          icon={<FolderKanban size={20} />}
          action={
            <Button variant="primary">
              <Plus size={16} /> New project
            </Button>
          }
        />

        <div className="mb-5">
          <DevStateBadge label="Development Mode — Projects not yet persistent" />
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban size={28} />}
            title="No projects yet."
            description="Create your first project and Sapphire will help you organize goals, tasks, and notes around it."
            action={<Button variant="primary"><Plus size={16} /> Create project</Button>}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedId(project.id)} />
            ))}
          </div>
        )}
      </PageTransition>
    </PageContainer>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const completedTasks = project.tasks.filter((t) => t.done).length;
  return (
    <Card hover onClick={onClick} className="group">
      <CardBody className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white truncate group-hover:text-sapphire-200 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Badge tone={STATUS_TONES[project.status]} dot>{project.status}</Badge>
          <Badge tone={PRIORITY_TONES[project.priority]}>{project.priority} priority</Badge>
        </div>
        <div className="mb-3">
          <div className="flex items-center justify-between text-2xs text-slate-500 mb-1.5">
            <span>{completedTasks}/{project.tasks.length} tasks</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} size="sm" />
        </div>
        <div className="flex items-center justify-between text-2xs text-slate-600">
          <span className="flex items-center gap-1">
            <Calendar size={11} /> Updated {formatRelativeTime(project.updatedAt)}
          </span>
          <span className="text-sapphire-300 group-hover:translate-x-0.5 transition-transform">Open →</span>
        </div>
      </CardBody>
    </Card>
  );
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const relatedConvs = conversations.filter((c) => c.projectId === project.id);
  const relatedMems = memories.filter((m) => m.category === 'projects' && m.content.toLowerCase().includes(project.name.toLowerCase().split(' ')[0]));
  const projectActivity = activityEvents.filter((a) => a.source === 'Projects' || a.action.toLowerCase().includes(project.name.toLowerCase().split(' ')[0]));

  return (
    <PageContainer>
      <PageTransition>
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to projects
        </button>

        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
              <p className="text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={STATUS_TONES[project.status]} dot>{project.status}</Badge>
            <Badge tone={PRIORITY_TONES[project.priority]}>{project.priority} priority</Badge>
          </div>
        </div>

        {/* Progress overview */}
        <Card className="mb-5">
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Progress</h3>
              <span className="text-2xl font-bold text-sapphire-300">{project.progress}%</span>
            </div>
            <Progress value={project.progress} size="md" />
            <div className="grid grid-cols-3 gap-4 mt-5">
              <Stat label="Tasks" value={`${project.tasks.filter((t) => t.done).length}/${project.tasks.length}`} />
              <Stat label="Goals" value={String(project.goals.length)} />
              <Stat label="Conversations" value={String(relatedConvs.length)} />
            </div>
          </CardBody>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Tasks */}
          <Card>
            <CardHeader title="Tasks" subtitle="Checklist for this project" />
            <CardBody className="space-y-1">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5"
                >
                  {task.done ? (
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Circle size={18} className="text-slate-600 shrink-0" />
                  )}
                  <span className={cn(
                    'text-sm',
                    task.done ? 'text-slate-500 line-through' : 'text-slate-200'
                  )}>
                    {task.title}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader title="Goals" subtitle="What this project aims to achieve" />
            <CardBody className="space-y-2.5">
              {project.goals.map((goal, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Target size={15} className="text-sapphire-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-300">{goal}</span>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Notes */}
          {project.notes && (
            <Card>
              <CardHeader title="Notes" />
              <CardBody>
                <p className="text-sm text-slate-300 leading-relaxed">{project.notes}</p>
              </CardBody>
            </Card>
          )}

          {/* Related conversations */}
          <Card>
            <CardHeader title="Conversations" subtitle="Related to this project" />
            <CardBody className="space-y-1">
              {relatedConvs.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">No related conversations yet.</p>
              ) : (
                relatedConvs.map((conv) => (
                  <div key={conv.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5 transition-colors">
                    <MessageSquare size={14} className="text-sapphire-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white truncate">{conv.title}</p>
                      <p className="text-2xs text-slate-600">{formatRelativeTime(conv.updatedAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          {/* Activity timeline */}
          <Card className="lg:col-span-2">
            <CardHeader title="Activity Timeline" subtitle="Recent events for this project" />
            <CardBody className="space-y-3">
              {projectActivity.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">No activity recorded yet.</p>
              ) : (
                projectActivity.map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className={cn(
                      'mt-1.5 h-2 w-2 rounded-full shrink-0',
                      event.status === 'success' && 'bg-emerald-400',
                      event.status === 'info' && 'bg-sapphire-400'
                    )} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-300">{event.action}</p>
                      <p className="text-2xs text-slate-600 mt-0.5">{formatRelativeTime(event.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </PageTransition>
    </PageContainer>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-2xs text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}
