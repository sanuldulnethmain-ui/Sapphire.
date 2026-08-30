import {
  Gem,
  MessageSquare,
  Search,
  PenTool,
  FolderKanban,
  Target,
  Brain,
  ArrowRight,
  Sparkles,
  Clock,
} from 'lucide-react';
import { PageTransition, PageContainer } from '@/components/layout/PageShell';
import { Card, CardHeader, CardBody, Badge, Progress } from '@/components/ui';
import { getGreeting, formatRelativeTime, cn } from '@/lib/utils';
import { currentUser, conversations, projects, goals, memories, activityEvents, sapphireStatus } from '@/lib/data';
import type { AppView } from '@/types';

export function HomeView({ onNavigate }: { onNavigate: (v: AppView) => void }) {
  const greeting = getGreeting();
  const activeGoals = goals.filter((g) => g.status === 'active');
  const activeProjects = projects.filter((p) => p.status === 'active' || p.status === 'planning');
  const recentConversations = conversations.slice(0, 3);
  const recentMemories = memories.slice(0, 3);
  const recentActivity = activityEvents.slice(0, 4);

  const quickActions = [
    { label: 'Start a conversation', icon: MessageSquare, view: 'conversation' as AppView, hint: 'Talk to Sapphire' },
    { label: 'Research something', icon: Search, view: 'research' as AppView, hint: 'Web research' },
    { label: 'Create something', icon: PenTool, view: 'creator' as AppView, hint: 'Content & ideas' },
    { label: 'Work on a project', icon: FolderKanban, view: 'projects' as AppView, hint: 'Projects' },
    { label: 'Review goals', icon: Target, view: 'goals' as AppView, hint: 'Goals' },
    { label: 'Search memory', icon: Brain, view: 'memory' as AppView, hint: 'What Sapphire knows' },
  ];

  return (
    <PageContainer className="max-w-6xl">
      <PageTransition>
        {/* Hero */}
        <div className="mb-10">
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-ink-200/60 via-ink-200/40 to-ink-300/30 p-6 md:p-10">
            {/* Ambient glow */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sapphire-500/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-aqua-500/5 blur-3xl" />
            <div className="absolute inset-0 dot-grid opacity-30" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Badge tone="sapphire" dot>
                  Founder Edition v0.1
                </Badge>
                <Badge tone="success" dot>
                  Core Ready
                </Badge>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight text-balance">
                {greeting}, {currentUser.preferredName}.
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mt-2 font-light">
                What are we working on?
              </p>

              {/* Central prompt */}
              <button
                onClick={() => onNavigate('conversation')}
                className="group mt-6 flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-white/8 bg-ink-300/40 px-5 py-4 text-left transition-all duration-300 hover:border-sapphire-500/30 hover:bg-ink-300/60 hover:shadow-glow-sm"
              >
                <Sparkles size={18} className="text-sapphire-400 shrink-0" />
                <span className="flex-1 text-sm md:text-base text-slate-500 group-hover:text-slate-400 transition-colors">
                  Ask Sapphire anything...
                </span>
                <ArrowRight size={18} className="text-slate-600 group-hover:text-sapphire-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Quick actions */}
              <div className="mt-5 flex flex-wrap gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={() => onNavigate(action.view)}
                      className="group flex items-center gap-2 rounded-xl border border-white/8 bg-ink-300/30 px-3.5 py-2 text-xs font-medium text-slate-400 transition-all hover:text-white hover:border-white/15 hover:bg-ink-300/50"
                    >
                      <Icon size={14} className="text-sapphire-400" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Today's focus + Recent activity */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Today's focus */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader
                title="Today's Focus"
                subtitle="Your active goals and projects"
                action={
                  <button
                    onClick={() => onNavigate('goals')}
                    className="text-xs text-sapphire-300 hover:text-sapphire-200 transition-colors"
                  >
                    View all
                  </button>
                }
              />
              <CardBody className="space-y-4">
                {activeGoals.slice(0, 3).map((goal) => (
                  <div
                    key={goal.id}
                    className="group cursor-pointer"
                    onClick={() => onNavigate('goals')}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="text-sm font-medium text-white truncate">{goal.title}</span>
                      <span className="text-2xs text-slate-500 shrink-0">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} size="sm" />
                  </div>
                ))}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{activeProjects.length} active projects</span>
                    <button
                      onClick={() => onNavigate('projects')}
                      className="text-sapphire-300 hover:text-sapphire-200 transition-colors"
                    >
                      View projects →
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Recent conversations */}
            <Card>
              <CardHeader
                title="Recent Conversations"
                action={
                  <button
                    onClick={() => onNavigate('conversation')}
                    className="text-xs text-sapphire-300 hover:text-sapphire-200 transition-colors"
                  >
                    View all
                  </button>
                }
              />
              <CardBody className="space-y-1">
                {recentConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => onNavigate('conversation')}
                    className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-white/5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5">
                      <MessageSquare size={14} className="text-sapphire-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{conv.title}</p>
                      <p className="text-2xs text-slate-500 truncate">{conv.summary}</p>
                    </div>
                    <span className="text-2xs text-slate-600 shrink-0">{formatRelativeTime(conv.updatedAt)}</span>
                  </button>
                ))}
              </CardBody>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Sapphire status */}
            <Card>
              <CardBody className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-sapphire-500/20 blur-lg" />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sapphire-500/20 to-aqua-500/10 border border-sapphire-400/20">
                      <Gem size={18} className="text-sapphire-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Sapphire Core</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                      <span className="text-2xs text-emerald-300 font-medium uppercase tracking-wider">Ready</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5 text-xs">
                  <StatusRow label="AI Layer" connected={sapphireStatus.aiConnected} />
                  <StatusRow label="Memory" connected={sapphireStatus.memoryConnected} />
                  <StatusRow label="Conversation" connected={true} />
                  <StatusRow label="Projects & Goals" connected={true} />
                </div>
              </CardBody>
            </Card>

            {/* Recent memories */}
            <Card>
              <CardHeader
                title="Recent Memories"
                action={
                  <button
                    onClick={() => onNavigate('memory')}
                    className="text-xs text-sapphire-300 hover:text-sapphire-200 transition-colors"
                  >
                    All
                  </button>
                }
              />
              <CardBody className="space-y-1">
                {recentMemories.map((mem) => (
                  <button
                    key={mem.id}
                    onClick={() => onNavigate('memory')}
                    className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-white/5"
                  >
                    <Brain size={14} className="text-aqua-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate">{mem.title}</p>
                      <p className="text-2xs text-slate-500 capitalize">{mem.category}</p>
                    </div>
                  </button>
                ))}
              </CardBody>
            </Card>

            {/* Activity */}
            <Card>
              <CardHeader
                title="Activity"
                action={
                  <button
                    onClick={() => onNavigate('activity')}
                    className="text-xs text-sapphire-300 hover:text-sapphire-200 transition-colors"
                  >
                    All
                  </button>
                }
              />
              <CardBody className="space-y-2.5">
                {recentActivity.map((event) => (
                  <div key={event.id} className="flex items-start gap-2.5">
                    <div className={cn(
                      'mt-1.5 h-1.5 w-1.5 rounded-full shrink-0',
                      event.status === 'success' && 'bg-emerald-400',
                      event.status === 'info' && 'bg-sapphire-400',
                      event.status === 'pending' && 'bg-amber-400',
                      event.status === 'failed' && 'bg-red-400'
                    )} />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-300 leading-snug">{event.action}</p>
                      <p className="text-2xs text-slate-600 mt-0.5 flex items-center gap-1">
                        <Clock size={9} /> {formatRelativeTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </PageTransition>
    </PageContainer>
  );
}

function StatusRow({ label, connected }: { label: string; connected: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      {connected ? (
        <span className="flex items-center gap-1.5 text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-2xs font-medium">Connected</span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
          <span className="text-2xs font-medium">Development</span>
        </span>
      )}
    </div>
  );
}
