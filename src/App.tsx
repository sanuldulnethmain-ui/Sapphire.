import { useState, useEffect, lazy, Suspense } from 'react';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { PageContainer } from '@/components/layout/PageShell';
import type { AppView } from '@/types';

// Lazy-load views for efficient initial load
const HomeView = lazy(() => import('@/views/HomeView').then((m) => ({ default: m.HomeView })));
const ConversationView = lazy(() => import('@/views/ConversationView').then((m) => ({ default: m.ConversationView })));
const MemoryView = lazy(() => import('@/views/MemoryView').then((m) => ({ default: m.MemoryView })));
const ProjectsView = lazy(() => import('@/views/ProjectsView').then((m) => ({ default: m.ProjectsView })));
const GoalsView = lazy(() => import('@/views/GoalsView').then((m) => ({ default: m.GoalsView })));
const MissionsView = lazy(() => import('@/views/MissionsView').then((m) => ({ default: m.MissionsView })));
const ResearchView = lazy(() => import('@/views/ResearchView').then((m) => ({ default: m.ResearchView })));
const CreatorView = lazy(() => import('@/views/CreatorView').then((m) => ({ default: m.CreatorView })));
const FilesView = lazy(() => import('@/views/FilesView').then((m) => ({ default: m.FilesView })));
const IntegrationsView = lazy(() => import('@/views/IntegrationsView').then((m) => ({ default: m.IntegrationsView })));
const ActivityView = lazy(() => import('@/views/ActivityView').then((m) => ({ default: m.ActivityView })));
const SettingsView = lazy(() => import('@/views/SettingsView').then((m) => ({ default: m.SettingsView })));

function ViewLoader() {
  return (
    <PageContainer>
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-sapphire-500/30 border-t-sapphire-400 animate-spin" />
          <span className="text-sm text-slate-500">Loading Sapphire…</span>
        </div>
      </div>
    </PageContainer>
  );
}

function App() {
  const [view, setView] = useState<AppView>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // Global keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleNavigate = (v: AppView) => {
    setView(v);
    // Scroll the main content area to top on view change
    const main = document.getElementById('sapphire-main');
    if (main) main.scrollTop = 0;
  };

  const isChatView = view === 'conversation';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ink-0">
      {/* Sidebar */}
      <Sidebar
        view={view}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar
          onOpenCommand={() => setCommandOpen(true)}
          onNavigate={handleNavigate}
          onOpenNotifications={() => {}}
          notificationOpen={false}
        />

        <main
          id="sapphire-main"
          className={isChatView ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto'}
        >
          <Suspense fallback={<ViewLoader />}>
            {view === 'home' && <HomeView onNavigate={handleNavigate} />}
            {view === 'conversation' && <ConversationView />}
            {view === 'memory' && <MemoryView />}
            {view === 'projects' && <ProjectsView />}
            {view === 'goals' && <GoalsView />}
            {view === 'missions' && <MissionsView />}
            {view === 'research' && <ResearchView />}
            {view === 'creator' && <CreatorView />}
            {view === 'files' && <FilesView />}
            {view === 'integrations' && <IntegrationsView />}
            {view === 'activity' && <ActivityView />}
            {view === 'settings' && <SettingsView onNavigate={handleNavigate} />}
          </Suspense>
        </main>
      </div>

      {/* Command palette */}
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Mobile navigation */}
      <MobileNav view={view} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
