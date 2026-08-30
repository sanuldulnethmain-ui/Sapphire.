import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Gem,
  Brain,
  Bell,
  Lock,
  Shield,
  Plug,
  Palette,
  Info,
  Check,
  ChevronRight,
} from 'lucide-react';
import { PageTransition, PageContainer, PageHeader } from '@/components/layout/PageShell';
import { Card, CardBody, Badge, Button, Input, Label, Avatar, Progress, StatusIndicator } from '@/components/ui';
import { cn, formatDate } from '@/lib/utils';
import { currentUser, sapphireStatus, permissionGroups, roadmap } from '@/lib/data';
import type { PermissionLevel } from '@/types';

type Section = 'profile' | 'sapphire' | 'memory' | 'notifications' | 'privacy' | 'security' | 'integrations' | 'appearance' | 'about';

const SECTIONS: { id: Section; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'sapphire', label: 'Sapphire', icon: Gem },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'about', label: 'About', icon: Info },
];

export function SettingsView({ onNavigate }: { onNavigate: (v: 'integrations') => void }) {
  const [section, setSection] = useState<Section>('profile');

  return (
    <PageContainer className="max-w-5xl">
      <PageTransition>
        <PageHeader
          title="Settings"
          subtitle="Manage your profile, Sapphire's behavior, and your privacy."
          icon={<SettingsIcon size={20} />}
        />

        <div className="grid gap-5 md:grid-cols-[200px_1fr]">
          {/* Section nav */}
          <div className="space-y-0.5">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = section === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    active
                      ? 'bg-sapphire-500/10 text-white border border-sapphire-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  )}
                >
                  <Icon size={16} className={cn(active && 'text-sapphire-300')} />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Section content */}
          <div>
            {section === 'profile' && <ProfileSection />}
            {section === 'sapphire' && <SapphireSection />}
            {section === 'memory' && <MemorySettingsSection />}
            {section === 'notifications' && <NotificationsSection />}
            {section === 'privacy' && <PrivacySection />}
            {section === 'security' && <SecuritySection />}
            {section === 'integrations' && <IntegrationsSection onNavigate={onNavigate} />}
            {section === 'appearance' && <AppearanceSection />}
            {section === 'about' && <AboutSection />}
          </div>
        </div>
      </PageTransition>
    </PageContainer>
  );
}

function ProfileSection() {
  return (
    <div className="space-y-4">
      <Card>
        <CardBody className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <Avatar name={currentUser.name} size="lg" />
            <div>
              <h3 className="text-base font-semibold text-white">{currentUser.name}</h3>
              <p className="text-xs text-slate-400">{currentUser.userNumber} · {currentUser.role}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Full Name</Label>
              <Input defaultValue={currentUser.name} />
            </div>
            <div>
              <Label>Preferred Name</Label>
              <Input defaultValue={currentUser.preferredName} />
            </div>
            <div>
              <Label>Timezone</Label>
              <Input defaultValue={currentUser.timezone} />
            </div>
            <div>
              <Label>Email</Label>
              <Input defaultValue={currentUser.email ?? ''} placeholder="Not set" />
            </div>
          </div>
          <div className="mt-4">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2">
              {currentUser.interests.map((interest) => (
                <Badge key={interest} tone="sapphire">{interest}</Badge>
              ))}
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button variant="primary">Save changes</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function SapphireSection() {
  return (
    <Card>
      <CardBody className="p-5 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Personality & Behavior</h3>
          <p className="text-xs text-slate-400">How Sapphire communicates and interacts with you.</p>
        </div>
        <SettingRow label="Formality" description="How formal Sapphire's language should be.">
          <select className="h-9 rounded-lg bg-ink-300/60 border border-white/8 px-3 text-sm text-white outline-none">
            <option className="bg-ink-400">Casual</option>
            <option className="bg-ink-400">Balanced</option>
            <option className="bg-ink-400">Formal</option>
          </select>
        </SettingRow>
        <SettingRow label="Detail Level" description="How detailed Sapphire's responses should be.">
          <select className="h-9 rounded-lg bg-ink-300/60 border border-white/8 px-3 text-sm text-white outline-none">
            <option className="bg-ink-400">Concise</option>
            <option className="bg-ink-400">Standard</option>
            <option className="bg-ink-400">Detailed</option>
          </select>
        </SettingRow>
        <SettingRow label="Proactive Suggestions" description="Sapphire can proactively suggest ideas and actions.">
          <Toggle defaultOn />
        </SettingRow>
      </CardBody>
    </Card>
  );
}

function MemorySettingsSection() {
  return (
    <Card>
      <CardBody className="p-5 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Memory Controls</h3>
          <p className="text-xs text-slate-400">Control what Sapphire remembers about you.</p>
        </div>
        <SettingRow label="Remember automatically" description="Sapphire saves useful information from conversations.">
          <Toggle />
        </SettingRow>
        <SettingRow label="Ask before remembering" description="Sapphire asks before saving new memories.">
          <Toggle defaultOn />
        </SettingRow>
        <SettingRow label="Memory transparency" description="Show memory activity in the Activity Center.">
          <Toggle defaultOn />
        </SettingRow>
        <div className="pt-4 border-t border-white/5">
          <Button variant="danger" size="sm">Forget everything</Button>
        </div>
      </CardBody>
    </Card>
  );
}

function NotificationsSection() {
  return (
    <Card>
      <CardBody className="p-5 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Notifications</h3>
          <p className="text-xs text-slate-400">Sapphire only notifies when useful.</p>
        </div>
        <SettingRow label="Mission completed" description="When a Sapphire mission finishes.">
          <Toggle defaultOn />
        </SettingRow>
        <SettingRow label="Approval required" description="When Sapphire needs your approval.">
          <Toggle defaultOn />
        </SettingRow>
        <SettingRow label="Project updates" description="When projects change status.">
          <Toggle />
        </SettingRow>
        <SettingRow label="Memory events" description="When Sapphire creates or updates a memory.">
          <Toggle />
        </SettingRow>
        <SettingRow label="Integration issues" description="When an integration disconnects.">
          <Toggle defaultOn />
        </SettingRow>
      </CardBody>
    </Card>
  );
}

function PrivacySection() {
  return (
    <Card>
      <CardBody className="p-5 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Privacy</h3>
          <p className="text-xs text-slate-400">Sapphire is not a surveillance tool, an advertising platform, or a manipulative assistant.</p>
        </div>
        <SettingRow label="Data stays private" description="Your data is never sold or shared.">
          <Badge tone="success" dot>Always</Badge>
        </SettingRow>
        <SettingRow label="No advertising" description="Sapphire will never show you ads.">
          <Badge tone="success" dot>Always</Badge>
        </SettingRow>
        <SettingRow label="Transparent memory" description="You can inspect, correct, and delete what Sapphire knows.">
          <Badge tone="success" dot>Always</Badge>
        </SettingRow>
      </CardBody>
    </Card>
  );
}

function SecuritySection() {
  return (
    <Card>
      <CardBody className="p-5 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Security</h3>
          <p className="text-xs text-slate-400">Sapphire's security architecture and your controls.</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-ink-300/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Permission System</span>
            <StatusIndicator status="ready" label="Active" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Approval System</span>
            <StatusIndicator status="ready" label="Active" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Authentication</span>
            <Badge tone="neutral" dot>Coming in v0.2</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Audit Logging</span>
            <Badge tone="neutral" dot>Planned</Badge>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function IntegrationsSection({ onNavigate }: { onNavigate: (v: 'integrations') => void }) {
  return (
    <Card>
      <CardBody className="p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white mb-1">Integrations</h3>
          <p className="text-xs text-slate-400">Manage connected services and their permissions.</p>
        </div>
        <button
          onClick={() => onNavigate('integrations')}
          className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-ink-300/30 p-4 hover:bg-ink-300/50 transition-colors"
        >
          <span className="text-sm text-white">View all integrations</span>
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </CardBody>
    </Card>
  );
}

function AppearanceSection() {
  return (
    <Card>
      <CardBody className="p-5 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Appearance</h3>
          <p className="text-xs text-slate-400">Sapphire's visual identity and your preferences.</p>
        </div>
        <SettingRow label="Theme" description="Sapphire is designed for dark mode. Light mode is planned.">
          <div className="flex gap-2">
            <div className="rounded-lg border-2 border-sapphire-500/40 bg-ink-300 px-3 py-1.5 text-xs font-medium text-white">Dark</div>
            <div className="rounded-lg border border-white/8 bg-ink-300/40 px-3 py-1.5 text-xs text-slate-500">Light (soon)</div>
          </div>
        </SettingRow>
        <SettingRow label="Accent Color" description="The primary sapphire blue accent.">
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-lg bg-sapphire-500 border-2 border-white/20" />
            <div className="h-8 w-8 rounded-lg bg-aqua-500 border-2 border-transparent" />
          </div>
        </SettingRow>
        <SettingRow label="Reduced Motion" description="Minimize animations and transitions.">
          <Toggle />
        </SettingRow>
      </CardBody>
    </Card>
  );
}

function AboutSection() {
  return (
    <div className="space-y-4">
      {/* Sapphire identity */}
      <Card>
        <CardBody className="p-5 text-center">
          <div className="mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-2xl bg-sapphire-500/20 blur-xl" />
            <div className="relative flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-sapphire-500/20 to-aqua-500/10 border border-sapphire-400/20">
              <Gem size={28} className="text-sapphire-300" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">Sapphire</h2>
          <p className="text-sm gradient-text font-medium mt-1">By Your Side.</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge tone="sapphire">Founder Edition {sapphireStatus.version}</Badge>
            <Badge tone="neutral">Prototype</Badge>
          </div>
        </CardBody>
      </Card>

      {/* Status */}
      <Card>
        <CardBody className="p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">System Status</h3>
          <div className="space-y-2">
            <StatusRow label="Sapphire Core" status="ready" />
            <StatusRow label="AI Layer" status={sapphireStatus.aiConnected ? 'ready' : 'offline'} />
            <StatusRow label="Memory" status={sapphireStatus.memoryConnected ? 'ready' : 'offline'} />
          </div>
        </CardBody>
      </Card>

      {/* Permissions */}
      <Card>
        <CardBody className="p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Permissions</h3>
          <p className="text-xs text-slate-400 mb-4">What Sapphire can do — and where it needs your approval.</p>
          <div className="space-y-4">
            {permissionGroups.map((group) => (
              <div key={group.id}>
                <div className="text-2xs font-medium uppercase tracking-wider text-slate-600 mb-2">{group.domain}</div>
                <div className="space-y-1">
                  {group.rules.map((rule) => (
                    <PermissionRow key={rule.id} action={rule.action} level={rule.level} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Roadmap */}
      <Card>
        <CardBody className="p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Roadmap</h3>
          <p className="text-xs text-slate-400 mb-4">Where Sapphire is heading.</p>
          <div className="space-y-3">
            {roadmap.map((item) => (
              <div key={item.version} className="flex items-start gap-3">
                <div className={cn(
                  'flex h-7 w-12 shrink-0 items-center justify-center rounded-lg text-2xs font-bold',
                  item.status === 'current'
                    ? 'bg-sapphire-500/15 text-sapphire-300 border border-sapphire-500/20'
                    : item.status === 'vision'
                    ? 'bg-aqua-500/10 text-aqua-300 border border-aqua-500/15'
                    : 'bg-ink-300/40 text-slate-500 border border-white/5'
                )}>
                  {item.version}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                  {item.status === 'current' && <Badge tone="success" className="mt-1.5" dot>Current</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <p className="text-center text-2xs text-slate-600">
        Sapphire Founder Edition v0.1 · Member since {formatDate(currentUser.createdAt)}
      </p>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        on ? 'bg-sapphire-500/80' : 'bg-ink-400'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all',
          on ? 'left-[22px]' : 'left-0.5'
        )}
      />
    </button>
  );
}

function PermissionRow({ action, level }: { action: string; level: PermissionLevel }) {
  const tones = {
    allowed: 'success' as const,
    'requires-approval': 'warning' as const,
    denied: 'error' as const,
  };
  const labels = {
    allowed: 'Allowed',
    'requires-approval': 'Requires approval',
    denied: 'Denied',
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg py-1.5">
      <span className="text-sm text-slate-300">{action}</span>
      <Badge tone={tones[level]} dot>{labels[level]}</Badge>
    </div>
  );
}

function StatusRow({ label, status }: { label: string; status: 'ready' | 'offline' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <StatusIndicator status={status} label={status === 'ready' ? 'Ready' : 'Development'} />
    </div>
  );
}
