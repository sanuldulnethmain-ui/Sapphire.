// Sapphire Core — Domain Types
// These interfaces are designed to map cleanly to a future PostgreSQL/Supabase schema.
// They are the single source of truth for data shapes across the application.

// ── User ──────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  userNumber: string; // e.g. "User #000001"
  role: string; // e.g. "Founder"
  name: string;
  preferredName: string;
  email?: string;
  timezone: string;
  interests: string[];
  communicationPreferences: CommunicationPreferences;
  createdAt: string;
}

export interface CommunicationPreferences {
  formality: 'casual' | 'balanced' | 'formal';
  detailLevel: 'concise' | 'standard' | 'detailed';
  proactiveSuggestions: boolean;
}

// ── Conversation ──────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  title: string;
  summary?: string;
  status: ConversationStatus;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  projectId?: string;
}

export type ConversationStatus = 'active' | 'archived';

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  createdAt: string;
  actions?: MessageAction[];
}

export type MessageRole = 'user' | 'sapphire';

export type MessageStatus =
  | 'sent'
  | 'thinking'
  | 'streaming'
  | 'complete'
  | 'error'
  | 'stopped';

export interface MessageAction {
  id: string;
  label: string;
  type: 'tool' | 'research' | 'memory' | 'approval';
  detail?: string;
  status: 'pending' | 'running' | 'complete' | 'failed' | 'awaiting-approval';
}

// ── Memory ────────────────────────────────────────────────────────────────────

export interface Memory {
  id: string;
  category: MemoryCategory;
  title: string;
  content: string;
  source: string;
  confidence: number; // 0–1
  important: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MemoryCategory =
  | 'identity'
  | 'preferences'
  | 'goals'
  | 'projects'
  | 'interests'
  | 'experiences'
  | 'lessons';

export type MemoryConsentMode =
  | 'remember-automatically'
  | 'ask-before-remembering'
  | 'never-remember';

// ── Projects ──────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number; // 0–100
  goals: string[];
  tasks: ProjectTask[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ProjectTask {
  id: string;
  title: string;
  done: boolean;
}

// ── Goals ─────────────────────────────────────────────────────────────────────

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  progress: number; // 0–100
  deadline?: string;
  projectId?: string;
  milestones: Milestone[];
  createdAt: string;
}

export type GoalCategory = 'personal' | 'learning' | 'business' | 'creative' | 'technical';
export type GoalStatus = 'active' | 'completed' | 'on-hold' | 'archived';

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
  targetDate?: string;
}

// ── Missions ──────────────────────────────────────────────────────────────────

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: MissionStatus;
  goalId?: string;
  steps: MissionStep[];
  createdAt: string;
  updatedAt: string;
}

export type MissionStatus = 'planning' | 'in-progress' | 'awaiting-approval' | 'completed' | 'failed';

export interface MissionStep {
  id: string;
  label: string;
  phase: MissionPhase;
  status: MissionStepStatus;
  agentType?: AgentType;
  detail?: string;
}

export type MissionPhase =
  | 'understand'
  | 'plan'
  | 'execute'
  | 'review'
  | 'approve'
  | 'report'
  | 'learn';

export type MissionStepStatus = 'pending' | 'running' | 'complete' | 'failed' | 'awaiting-approval';

// ── Agents (future) ───────────────────────────────────────────────────────────

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  status: AgentStatus;
  capabilities: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export type AgentType =
  | 'conversation'
  | 'research'
  | 'creator'
  | 'business'
  | 'computer'
  | 'planning'
  | 'automation'
  | 'trading-research';

export type AgentStatus = 'offline' | 'standby' | 'active' | 'error';

// ── Tools ─────────────────────────────────────────────────────────────────────

export interface Tool {
  id: string;
  name: string;
  category: string;
  status: ToolStatus;
  riskLevel: 'low' | 'medium' | 'high';
  authenticated: boolean;
  capabilities: string[];
}

export type ToolStatus = 'available' | 'connected' | 'disconnected' | 'coming-soon';

// ── Integrations ──────────────────────────────────────────────────────────────

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name key
  status: IntegrationStatus;
  permissions: string[];
  category: string;
}

export type IntegrationStatus = 'connected' | 'disconnected' | 'coming-soon';

// ── Permissions ───────────────────────────────────────────────────────────────

export interface PermissionGroup {
  id: string;
  domain: string; // e.g. "Gmail", "Files", "Financial"
  rules: PermissionRule[];
}

export interface PermissionRule {
  id: string;
  action: string;
  level: PermissionLevel;
}

export type PermissionLevel = 'allowed' | 'requires-approval' | 'denied';

// ── Approvals ─────────────────────────────────────────────────────────────────

export interface ApprovalRequest {
  id: string;
  title: string;
  action: string;
  reason: string;
  domain: string;
  riskLevel: 'medium' | 'high';
  detail?: string;
  createdAt: string;
}

// ── Activity ──────────────────────────────────────────────────────────────────

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  action: string;
  source: string;
  status: 'success' | 'pending' | 'failed' | 'info';
  timestamp: string;
}

export type ActivityEventType =
  | 'memory-created'
  | 'project-updated'
  | 'research-completed'
  | 'email-drafted'
  | 'mission-started'
  | 'integration-connected'
  | 'conversation-created'
  | 'goal-updated'
  | 'system';

// ── Files ─────────────────────────────────────────────────────────────────────

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  createdAt: string;
  projectId?: string;
  status: 'uploaded' | 'processing' | 'ready';
}

// ── Research ──────────────────────────────────────────────────────────────────

export interface ResearchSession {
  id: string;
  query: string;
  status: ResearchStatus;
  sources: ResearchSource[];
  summary?: string;
  createdAt: string;
}

export type ResearchStatus = 'planning' | 'researching' | 'completed' | 'failed';

export interface ResearchSource {
  id: string;
  title: string;
  url?: string;
  snippet: string;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export type NotificationType =
  | 'mission-completed'
  | 'approval-required'
  | 'project-update'
  | 'memory-event'
  | 'integration-issue'
  | 'system-alert';

// ── Navigation ────────────────────────────────────────────────────────────────

export type AppView =
  | 'home'
  | 'conversation'
  | 'memory'
  | 'projects'
  | 'goals'
  | 'missions'
  | 'research'
  | 'creator'
  | 'files'
  | 'integrations'
  | 'activity'
  | 'settings';

// ── Sapphire status ───────────────────────────────────────────────────────────

export interface SapphireStatus {
  core: 'ready' | 'processing' | 'degraded' | 'offline';
  aiConnected: boolean;
  memoryConnected: boolean;
  version: string;
  edition: string;
}
