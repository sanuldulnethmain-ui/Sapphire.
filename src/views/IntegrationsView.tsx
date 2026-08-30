import {
  Plug,
  Mail,
  Calendar,
  Github,
  HardDrive,
  Rocket,
  Database,
  MessageCircle,
  Globe,
  Check,
  Plus,
} from 'lucide-react';
import { PageTransition, PageContainer, PageHeader, DevStateBadge } from '@/components/layout/PageShell';
import { Card, CardBody, Badge, Button, StatusIndicator } from '@/components/ui';
import { integrations } from '@/lib/data';
import type { Integration } from '@/types';

const ICONS: Record<string, typeof Mail> = {
  mail: Mail,
  calendar: Calendar,
  github: Github,
  'hard-drive': HardDrive,
  rocket: Rocket,
  database: Database,
  'message-circle': MessageCircle,
  globe: Globe,
};

export function IntegrationsView() {
  return (
    <PageContainer>
      <PageTransition>
        <PageHeader
          title="Integrations"
          subtitle="Connect external services to Sapphire. You control what each integration can do."
          icon={<Plug size={20} />}
        />

        <div className="mb-5">
          <DevStateBadge label="No integrations are currently connected" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {integrations.map((int) => (
            <IntegrationCard key={int.id} integration={int} />
          ))}
        </div>
      </PageTransition>
    </PageContainer>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const Icon = ICONS[integration.icon] ?? Plug;
  const isComingSoon = integration.status === 'coming-soon';
  const isConnected = integration.status === 'connected';

  return (
    <Card hover={false} className="group transition-all hover:border-white/10">
      <CardBody className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sapphire-500/15 to-aqua-500/10 border border-sapphire-400/15 text-sapphire-300">
            <Icon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">{integration.name}</h3>
              {isConnected && <StatusIndicator status="ready" size="sm" />}
              {isComingSoon && <Badge tone="neutral">Coming soon</Badge>}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">{integration.description}</p>

            {integration.permissions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {integration.permissions.map((perm) => (
                  <span key={perm} className="inline-flex items-center gap-1 rounded-md bg-white/5 border border-white/5 px-2 py-0.5 text-2xs text-slate-400">
                    <Check size={10} className="text-slate-500" /> {perm}
                  </span>
                ))}
              </div>
            )}

            <Button
              variant={isConnected ? 'outline' : 'secondary'}
              size="sm"
              disabled={isComingSoon}
              className="w-full"
            >
              {isConnected ? (
                <>Disconnect</>
              ) : isComingSoon ? (
                <>Coming soon</>
              ) : (
                <><Plus size={14} /> Connect</>
              )}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
