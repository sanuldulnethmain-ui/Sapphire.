import { useState } from 'react';
import { Search, Globe, FileText, Bookmark, ExternalLink, Sparkles } from 'lucide-react';
import { PageTransition, PageContainer, PageHeader, DevStateBadge } from '@/components/layout/PageShell';
import { Card, CardBody, Badge, Button, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';

export function ResearchView() {
  const [query, setQuery] = useState('');

  return (
    <PageContainer>
      <PageTransition>
        <PageHeader
          title="Research Center"
          subtitle="Sapphire will research the web, gather sources, and synthesize findings."
          icon={<Search size={20} />}
        />

        <div className="mb-5">
          <DevStateBadge label="Development Mode — Web research not yet connected" />
        </div>

        {/* Research prompt */}
        <Card className="mb-5">
          <CardBody className="p-5">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What would you like Sapphire to research?"
                className="h-12 w-full rounded-xl bg-ink-300/40 border border-white/8 pl-12 pr-32 text-sm text-white placeholder:text-slate-500 focus:border-sapphire-500/30 focus:ring-2 focus:ring-sapphire-500/15 outline-none transition-all"
              />
              <Button
                variant="primary"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                disabled
              >
                <Sparkles size={14} /> Research
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Market trends for AI tools', 'Best practices for system design', 'Competitor analysis'].map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-white/8 bg-ink-300/30 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:border-white/15 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Feature preview */}
        <div className="grid gap-4 md:grid-cols-3 mb-5">
          <FeaturePreview icon={Globe} title="Web Research" description="Sapphire searches multiple sources and evaluates credibility." />
          <FeaturePreview icon={FileText} title="Summaries" description="Synthesized findings with key insights and citations." />
          <FeaturePreview icon={Bookmark} title="Saved Research" description="Bookmark sessions and revisit them anytime." />
        </div>

        {/* Empty state */}
        <EmptyState
          icon={<Search size={28} />}
          title="No research sessions yet."
          description="When the research backend is connected, Sapphire will be able to search the web, evaluate sources, and deliver cited summaries. This is a development state — no live internet results are shown."
        />
      </PageTransition>
    </PageContainer>
  );
}

function FeaturePreview({ icon: Icon, title, description }: { icon: typeof Globe; title: string; description: string }) {
  return (
    <Card hover={false}>
      <CardBody className="p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sapphire-500/10 border border-sapphire-500/15 text-sapphire-300 mb-3">
          <Icon size={18} />
        </div>
        <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </CardBody>
    </Card>
  );
}
