import { Activity, Brain, FolderKanban, Search, Mail, Rocket, Plug, MessageSquare, Target, Cpu } from 'lucide-react';
import { PageTransition, PageContainer, PageHeader } from '@/components/layout/PageShell';
import { Card, CardBody, Badge } from '@/components/ui';
import { cn, formatRelativeTime, formatTime } from '@/lib/utils';
import { activityEvents } from '@/lib/data';
import type { ActivityEventType } from '@/types';

const EVENT_ICONS: Record<ActivityEventType, typeof Brain> = {
  'memory-created': Brain,
  'project-updated': FolderKanban,
  'research-completed': Search,
  'email-drafted': Mail,
  'mission-started': Rocket,
  'integration-connected': Plug,
  'conversation-created': MessageSquare,
  'goal-updated': Target,
  system: Cpu,
};

const STATUS_TONES = {
  success: 'success' as const,
  pending: 'warning' as const,
  failed: 'error' as const,
  info: 'sapphire' as const,
};

const STATUS_DOTS = {
  success: 'bg-emerald-400',
  pending: 'bg-amber-400',
  failed: 'bg-red-400',
  info: 'bg-sapphire-400',
};

export function ActivityView() {
  // Group events by date
  const today = activityEvents.filter((e) => formatRelativeTime(e.timestamp).includes('h') || formatRelativeTime(e.timestamp).includes('m') || formatRelativeTime(e.timestamp).includes('just'));
  const earlier = activityEvents.filter((e) => !today.includes(e));

  return (
    <PageContainer>
      <PageTransition>
        <PageHeader
          title="Activity Center"
          subtitle="A transparent timeline of everything Sapphire has done."
          icon={<Activity size={20} />}
        />

        <div className="space-y-6">
          {today.length > 0 && (
            <ActivityGroup label="Today" events={today} />
          )}
          {earlier.length > 0 && (
            <ActivityGroup label="Earlier" events={earlier} />
          )}
        </div>
      </PageTransition>
    </PageContainer>
  );
}

function ActivityGroup({ label, events }: { label: string; events: typeof activityEvents }) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-slate-600 mb-3 px-1">{label}</h3>
      <Card>
        <div className="divide-y divide-white/5">
          {events.map((event) => {
            const Icon = EVENT_ICONS[event.type] ?? Activity;
            return (
              <div key={event.id} className="flex items-start gap-4 p-4 hover:bg-white/5 transition-colors group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/5">
                  <Icon size={16} className="text-sapphire-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-200 leading-snug">{event.action}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-2xs text-slate-600">{event.source}</span>
                    <span className="text-2xs text-slate-700">·</span>
                    <span className="text-2xs text-slate-600">{formatTime(event.timestamp)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn('h-2 w-2 rounded-full', STATUS_DOTS[event.status])} />
                  <Badge tone={STATUS_TONES[event.status]}>{event.status}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
