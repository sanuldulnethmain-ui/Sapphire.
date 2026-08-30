import { PenTool, FileText, Image, Video, Code, Lightbulb, FileCode } from 'lucide-react';
import { PageTransition, PageContainer, PageHeader, DevStateBadge } from '@/components/layout/PageShell';
import { Card, CardBody, Badge, EmptyState } from '@/components/ui';

const CREATIVE_TOOLS = [
  { icon: FileText, name: 'Scripts', description: 'Draft scripts for videos, podcasts, and presentations.' },
  { icon: Image, name: 'Images', description: 'Generate visual concepts and illustrations.' },
  { icon: Video, name: 'Videos', description: 'Plan and storyboard video content.' },
  { icon: Code, name: 'Websites', description: 'Design and build web pages and landing pages.' },
  { icon: FileCode, name: 'Documents', description: 'Create structured documents and proposals.' },
  { icon: Lightbulb, name: 'Ideas', description: 'Brainstorm and develop creative ideas.' },
];

export function CreatorView() {
  return (
    <PageContainer>
      <PageTransition>
        <PageHeader
          title="Creator Center"
          subtitle="Sapphire will assist with scripts, videos, images, websites, and content."
          icon={<PenTool size={20} />}
        />

        <div className="mb-5">
          <DevStateBadge label="Development Mode — Generation systems not yet connected" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {CREATIVE_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.name} hover={false} className="group transition-all hover:border-white/10">
                <CardBody className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sapphire-500/15 to-aqua-500/10 border border-sapphire-400/15 text-sapphire-300 mb-3">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{tool.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{tool.description}</p>
                  <div className="mt-3">
                    <Badge tone="neutral" dot>Coming soon</Badge>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <EmptyState
          icon={<PenTool size={28} />}
          title="Creator tools are being prepared."
          description="Sapphire's creator capabilities — content generation, scripting, ideation, and design — will be connected in a future version. The architecture is ready for them to plug in."
        />
      </PageTransition>
    </PageContainer>
  );
}
