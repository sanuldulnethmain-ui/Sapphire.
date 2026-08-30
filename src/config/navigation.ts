import {
  Home,
  MessageSquare,
  Brain,
  FolderKanban,
  Target,
  Rocket,
  Search,
  PenTool,
  FileText,
  Plug,
  Activity,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import type { AppView } from '@/types';

export interface NavItem {
  id: AppView;
  label: string;
  icon: LucideIcon;
  group: 'main' | 'workspace' | 'system';
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, group: 'main' },
  { id: 'conversation', label: 'Conversation', icon: MessageSquare, group: 'main' },
  { id: 'memory', label: 'Memory', icon: Brain, group: 'main' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, group: 'workspace' },
  { id: 'goals', label: 'Goals', icon: Target, group: 'workspace' },
  { id: 'missions', label: 'Missions', icon: Rocket, group: 'workspace' },
  { id: 'research', label: 'Research', icon: Search, group: 'workspace' },
  { id: 'creator', label: 'Creator', icon: PenTool, group: 'workspace' },
  { id: 'files', label: 'Files', icon: FileText, group: 'workspace' },
  { id: 'integrations', label: 'Integrations', icon: Plug, group: 'system' },
  { id: 'activity', label: 'Activity', icon: Activity, group: 'system' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'system' },
];
