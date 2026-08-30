// Sapphire Data Access Layer
//
// This module provides a single source of truth for data in v0.1.
// All data here is clearly-marked DEVELOPMENT / MOCK data.
// When Supabase is connected, these functions will be replaced with
// real database queries — components should import from here so the
// swap is seamless.
//
// DO NOT treat this data as persistent or production-real.

import type {
  UserProfile,
  Conversation,
  Message,
  Memory,
  Project,
  Goal,
  Mission,
  Agent,
  Tool,
  Integration,
  PermissionGroup,
  ApprovalRequest,
  ActivityEvent,
  FileItem,
  ResearchSession,
  Notification,
  SapphireStatus,
} from '@/types';

export const DATA_SOURCE = 'mock-v0.1' as const;

// ── Sapphire status ───────────────────────────────────────────────────────────

export const sapphireStatus: SapphireStatus = {
  core: 'ready',
  aiConnected: false,
  memoryConnected: false,
  version: 'v0.1',
  edition: 'Founder Edition',
};

// ── User ──────────────────────────────────────────────────────────────────────

export const currentUser: UserProfile = {
  id: 'usr_000001',
  userNumber: 'User #000001',
  role: 'Founder',
  name: 'Sanul',
  preferredName: 'Sanul',
  timezone: 'Asia/Colombo (GMT+5:30)',
  interests: ['AI systems', 'Product design', 'Entrepreneurship', 'Web development', 'Music'],
  communicationPreferences: {
    formality: 'balanced',
    detailLevel: 'standard',
    proactiveSuggestions: true,
  },
  createdAt: '2026-08-01T00:00:00Z',
};

// ── Conversations ─────────────────────────────────────────────────────────────

export const conversations: Conversation[] = [
  {
    id: 'conv_1',
    title: 'Sapphire architecture planning',
    summary: 'Discussed the core architecture and module separation for v0.1.',
    status: 'active',
    messageCount: 12,
    createdAt: '2026-08-28T14:20:00Z',
    updatedAt: '2026-08-28T18:45:00Z',
    pinned: true,
    projectId: 'proj_1',
  },
  {
    id: 'conv_2',
    title: 'Hotel website mission',
    summary: 'Planning the hotel website build mission and required tools.',
    status: 'active',
    messageCount: 8,
    createdAt: '2026-08-27T09:15:00Z',
    updatedAt: '2026-08-27T11:30:00Z',
    projectId: 'proj_2',
  },
  {
    id: 'conv_3',
    title: 'Learning roadmap discussion',
    summary: 'Explored a 3-month learning plan for systems design.',
    status: 'active',
    messageCount: 15,
    createdAt: '2026-08-26T16:00:00Z',
    updatedAt: '2026-08-26T20:10:00Z',
  },
  {
    id: 'conv_4',
    title: 'Memory model design',
    summary: 'Discussed how Sapphire should remember and categorize information.',
    status: 'active',
    messageCount: 6,
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-08-25T12:00:00Z',
  },
  {
    id: 'conv_5',
    title: 'Weekend project ideas',
    summary: 'Brainstormed creative project ideas and prioritized them.',
    status: 'archived',
    messageCount: 4,
    createdAt: '2026-08-20T19:00:00Z',
    updatedAt: '2026-08-20T21:00:00Z',
  },
];

// ── Messages (for the active conversation) ────────────────────────────────────

export const sampleMessages: Message[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    role: 'user',
    content:
      "Let's talk about the architecture for Sapphire v0.1. I want the foundation to be clean enough that we can add agents, tools, and memory without rebuilding everything.",
    status: 'complete',
    createdAt: '2026-08-28T14:20:00Z',
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    role: 'sapphire',
    content:
      'That is a strong starting principle. For v0.1, the architecture should separate three concerns: the conversation engine, the memory engine, and mission control. Each one communicates through a shared core, and the UI never talks directly to any provider — it goes through the Sapphire AI service abstraction.\n\nThis way, when you add a research agent or a tool system later, it plugs into the core without touching the conversation UI. Would you like to start with the conversation engine or the memory model first?',
    status: 'complete',
    createdAt: '2026-08-28T14:22:00Z',
  },
  {
    id: 'msg_3',
    conversationId: 'conv_1',
    role: 'user',
    content: 'Conversation first. That is the heart of Sapphire.',
    status: 'complete',
    createdAt: '2026-08-28T14:24:00Z',
  },
  {
    id: 'msg_4',
    conversationId: 'conv_1',
    role: 'sapphire',
    content:
      'Agreed. The conversation interface is where the relationship begins. I would recommend designing it for streaming responses from the start — even though the AI layer is not connected yet, the UI should already support the streaming architecture so we do not have to rebuild it later.\n\nThe same applies to the processing states: thinking, researching, using a tool, waiting for approval. If those states exist in the UI now, adding the backend later is just wiring.',
    status: 'complete',
    createdAt: '2026-08-28T14:26:00Z',
  },
];

// ── Memory ────────────────────────────────────────────────────────────────────

export const memories: Memory[] = [
  {
    id: 'mem_1',
    category: 'identity',
    title: 'Founder identity',
    content:
      'Sanul is the founder of Sapphire. Designated as User #000001. Building Sapphire as a personal AI operating system.',
    source: 'Onboarding',
    confidence: 1.0,
    important: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'mem_2',
    category: 'preferences',
    title: 'Communication style',
    content:
      'Prefers balanced formality — not overly casual, not rigid. Standard detail level. Appreciates proactive suggestions.',
    source: 'Onboarding',
    confidence: 0.95,
    important: false,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-10T00:00:00Z',
  },
  {
    id: 'mem_3',
    category: 'goals',
    title: 'Build Sapphire v0.1',
    content:
      'Primary goal: ship Sapphire Founder Edition v0.1 with a clean conversation interface, memory architecture, and project management.',
    source: 'Conversation',
    confidence: 0.98,
    important: true,
    createdAt: '2026-08-05T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
  },
  {
    id: 'mem_4',
    category: 'projects',
    title: 'Hotel website project',
    content:
      'Sanul is planning to build a hotel website. This is a candidate for the first Sapphire mission.',
    source: 'Conversation',
    confidence: 0.9,
    important: false,
    createdAt: '2026-08-27T00:00:00Z',
    updatedAt: '2026-08-27T00:00:00Z',
  },
  {
    id: 'mem_5',
    category: 'interests',
    title: 'Interest in systems design',
    content:
      'Currently learning systems design and scalable architecture. Interested in how large platforms are structured.',
    source: 'Conversation',
    confidence: 0.85,
    important: false,
    createdAt: '2026-08-20T00:00:00Z',
    updatedAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'mem_6',
    category: 'lessons',
    title: 'Prefers architecture-first',
    content:
      'When starting a new project, Sanul prefers to discuss architecture and foundations before writing features.',
    source: 'Observed pattern',
    confidence: 0.8,
    important: false,
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z',
  },
  {
    id: 'mem_7',
    category: 'experiences',
    title: 'Timezone',
    content: 'Based in GMT+5:30. Most productive in the evening.',
    source: 'Onboarding',
    confidence: 0.9,
    important: false,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
];

// ── Projects ──────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: 'proj_1',
    name: 'Project Sapphire',
    description: 'Building Sapphire into a personal AI operating system.',
    status: 'active',
    priority: 'critical',
    progress: 35,
    goals: [
      'Ship v0.1 with conversation, memory, and projects',
      'Establish clean architecture for future agents',
      'Design permission and approval system',
    ],
    tasks: [
      { id: 't1', title: 'Application shell and navigation', done: true },
      { id: 't2', title: 'Conversation interface', done: true },
      { id: 't3', title: 'Memory center', done: false },
      { id: 't4', title: 'Mission control prototype', done: false },
      { id: 't5', title: 'Settings and permissions', done: false },
    ],
    notes:
      'v0.1 is about the foundation. Every interface should be designed so future capabilities can plug in without rebuilding.',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
  },
  {
    id: 'proj_2',
    name: 'Hotel Website',
    description: 'A hotel website build — the first candidate for a Sapphire mission.',
    status: 'planning',
    priority: 'high',
    progress: 10,
    goals: ['Define site structure', 'Choose tech stack', 'Plan content sections'],
    tasks: [
      { id: 't6', title: 'Gather requirements', done: true },
      { id: 't7', title: 'Design wireframes', done: false },
      { id: 't8', title: 'Build landing page', done: false },
    ],
    notes: 'This will eventually be coordinated through Mission Control.',
    createdAt: '2026-08-27T00:00:00Z',
    updatedAt: '2026-08-27T00:00:00Z',
  },
  {
    id: 'proj_3',
    name: 'Learning Roadmap',
    description: 'A structured 3-month plan for systems design and scalable architecture.',
    status: 'active',
    priority: 'medium',
    progress: 45,
    goals: ['Complete systems design fundamentals', 'Study distributed systems patterns'],
    tasks: [
      { id: 't9', title: 'Read Designing Data-Intensive Applications', done: true },
      { id: 't10', title: 'Study load balancing and caching', done: false },
      { id: 't11', title: 'Build a small distributed prototype', done: false },
    ],
    notes: '',
    createdAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-26T00:00:00Z',
  },
];

// ── Goals ─────────────────────────────────────────────────────────────────────

export const goals: Goal[] = [
  {
    id: 'goal_1',
    title: 'Ship Sapphire v0.1',
    description: 'Release the first version of Sapphire with conversation, memory, and project management.',
    category: 'technical',
    status: 'active',
    progress: 35,
    projectId: 'proj_1',
    milestones: [
      { id: 'm1', title: 'Application shell', done: true },
      { id: 'm2', title: 'Conversation interface', done: true },
      { id: 'm3', title: 'Memory center', done: false },
      { id: 'm4', title: 'Mission control prototype', done: false },
      { id: 'm5', title: 'Settings and permissions', done: false },
    ],
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'goal_2',
    title: 'Master systems design',
    description: 'Develop a deep understanding of scalable system architecture over 3 months.',
    category: 'learning',
    status: 'active',
    progress: 45,
    projectId: 'proj_3',
    milestones: [
      { id: 'm6', title: 'Complete fundamentals course', done: true },
      { id: 'm7', title: 'Study distributed systems', done: false },
      { id: 'm8', title: 'Build a distributed prototype', done: false },
    ],
    createdAt: '2026-08-10T00:00:00Z',
  },
  {
    id: 'goal_3',
    title: 'Launch hotel website',
    description: 'Plan, design, and launch a complete hotel website.',
    category: 'business',
    status: 'active',
    progress: 10,
    projectId: 'proj_2',
    deadline: '2026-10-15T00:00:00Z',
    milestones: [
      { id: 'm9', title: 'Requirements gathered', done: true },
      { id: 'm10', title: 'Wireframes approved', done: false },
      { id: 'm11', title: 'Site built and deployed', done: false },
    ],
    createdAt: '2026-08-27T00:00:00Z',
  },
  {
    id: 'goal_4',
    title: 'Write consistently',
    description: 'Publish one article per week about AI, design, or entrepreneurship.',
    category: 'creative',
    status: 'active',
    progress: 20,
    milestones: [
      { id: 'm12', title: 'Set up publishing workflow', done: true },
      { id: 'm13', title: 'Publish first 4 articles', done: false },
    ],
    createdAt: '2026-08-15T00:00:00Z',
  },
];

// ── Missions ──────────────────────────────────────────────────────────────────

export const missions: Mission[] = [
  {
    id: 'mis_1',
    title: 'Build hotel website',
    description: 'Coordinate the planning, design, and build of a hotel website using future Sapphire agents.',
    status: 'planning',
    goalId: 'goal_3',
    steps: [
      {
        id: 'ms1',
        label: 'Understand the objective and requirements',
        phase: 'understand',
        status: 'complete',
        agentType: 'conversation',
        detail: 'Requirements gathered from conversation.',
      },
      {
        id: 'ms2',
        label: 'Create a build plan',
        phase: 'plan',
        status: 'running',
        agentType: 'planning',
        detail: 'Planning agent is drafting the site structure.',
      },
      {
        id: 'ms3',
        label: 'Assign agents to tasks',
        phase: 'execute',
        status: 'pending',
        agentType: 'creator',
      },
      {
        id: 'ms4',
        label: 'Review generated results',
        phase: 'review',
        status: 'pending',
      },
      {
        id: 'ms5',
        label: 'Request approval before deployment',
        phase: 'approve',
        status: 'pending',
        detail: 'Deployment requires your approval.',
      },
      {
        id: 'ms6',
        label: 'Report results and learn',
        phase: 'report',
        status: 'pending',
      },
    ],
    createdAt: '2026-08-27T00:00:00Z',
    updatedAt: '2026-08-28T00:00:00Z',
  },
];

// ── Agents (future) ───────────────────────────────────────────────────────────

export const agents: Agent[] = [
  {
    id: 'agent_conv',
    type: 'conversation',
    name: 'Conversation Agent',
    description: 'Handles natural human communication and understanding.',
    status: 'standby',
    capabilities: ['Natural conversation', 'Context awareness', 'Intent detection'],
    riskLevel: 'low',
  },
  {
    id: 'agent_research',
    type: 'research',
    name: 'Research Agent',
    description: 'Performs web research, gathers sources, and synthesizes summaries.',
    status: 'offline',
    capabilities: ['Web search', 'Source evaluation', 'Summarization'],
    riskLevel: 'low',
  },
  {
    id: 'agent_creator',
    type: 'creator',
    name: 'Creator Agent',
    description: 'Generates scripts, images, videos, and written content.',
    status: 'offline',
    capabilities: ['Content generation', 'Scripting', 'Ideation'],
    riskLevel: 'medium',
  },
  {
    id: 'agent_planning',
    type: 'planning',
    name: 'Planning Agent',
    description: 'Breaks down goals into tasks, missions, and execution plans.',
    status: 'standby',
    capabilities: ['Goal decomposition', 'Task scheduling', 'Dependency mapping'],
    riskLevel: 'low',
  },
  {
    id: 'agent_business',
    type: 'business',
    name: 'Business Agent',
    description: 'Assists with business tasks, outreach, and analysis.',
    status: 'offline',
    capabilities: ['Email drafting', 'Analysis', 'Reporting'],
    riskLevel: 'medium',
  },
  {
    id: 'agent_computer',
    type: 'computer',
    name: 'Computer Agent',
    description: 'Interacts with the browser and desktop applications.',
    status: 'offline',
    capabilities: ['Browser automation', 'File management', 'App control'],
    riskLevel: 'high',
  },
  {
    id: 'agent_automation',
    type: 'automation',
    name: 'Automation Agent',
    description: 'Runs background workflows and recurring tasks.',
    status: 'offline',
    capabilities: ['Scheduled tasks', 'Workflow chains', 'Monitoring'],
    riskLevel: 'medium',
  },
  {
    id: 'agent_trading',
    type: 'trading-research',
    name: 'Trading Research Agent',
    description: 'Performs market research and analysis. Research-only — never executes trades.',
    status: 'offline',
    capabilities: ['Market analysis', 'Trend research', 'Report generation'],
    riskLevel: 'high',
  },
];

// ── Tools ─────────────────────────────────────────────────────────────────────

export const tools: Tool[] = [
  { id: 'tool_web', name: 'Web Search', category: 'Research', status: 'coming-soon', riskLevel: 'low', authenticated: false, capabilities: ['Search the web', 'Retrieve pages'] },
  { id: 'tool_browser', name: 'Browser', category: 'Automation', status: 'coming-soon', riskLevel: 'medium', authenticated: false, capabilities: ['Navigate pages', 'Extract content'] },
  { id: 'tool_email', name: 'Email', category: 'Communication', status: 'coming-soon', riskLevel: 'medium', authenticated: false, capabilities: ['Read', 'Draft', 'Send (with approval)'] },
  { id: 'tool_calendar', name: 'Calendar', category: 'Productivity', status: 'coming-soon', riskLevel: 'low', authenticated: false, capabilities: ['View events', 'Create events'] },
  { id: 'tool_github', name: 'GitHub', category: 'Development', status: 'coming-soon', riskLevel: 'medium', authenticated: false, capabilities: ['Read repos', 'Create issues'] },
  { id: 'tool_files', name: 'Files', category: 'Storage', status: 'coming-soon', riskLevel: 'medium', authenticated: false, capabilities: ['Read', 'Write', 'Organize'] },
  { id: 'tool_image', name: 'Image Generation', category: 'Creative', status: 'coming-soon', riskLevel: 'low', authenticated: false, capabilities: ['Generate images'] },
  { id: 'tool_code', name: 'Code Execution', category: 'Development', status: 'coming-soon', riskLevel: 'high', authenticated: false, capabilities: ['Run code', 'Build projects'] },
  { id: 'tool_deploy', name: 'Deployment', category: 'DevOps', status: 'coming-soon', riskLevel: 'high', authenticated: false, capabilities: ['Deploy applications'] },
];

// ── Integrations ──────────────────────────────────────────────────────────────

export const integrations: Integration[] = [
  { id: 'int_gmail', name: 'Gmail', description: 'Read, draft, and manage email through Sapphire.', icon: 'mail', status: 'disconnected', permissions: ['Read emails', 'Draft replies'], category: 'Communication' },
  { id: 'int_gcal', name: 'Google Calendar', description: 'View and manage your schedule.', icon: 'calendar', status: 'disconnected', permissions: ['Read events', 'Create events'], category: 'Productivity' },
  { id: 'int_github', name: 'GitHub', description: 'Connect repositories for code assistance.', icon: 'github', status: 'disconnected', permissions: ['Read repos', 'Manage issues'], category: 'Development' },
  { id: 'int_gdrive', name: 'Google Drive', description: 'Access and organize your files.', icon: 'hard-drive', status: 'disconnected', permissions: ['Read files', 'Upload files'], category: 'Storage' },
  { id: 'int_vercel', name: 'Vercel', description: 'Deploy and manage web projects.', icon: 'rocket', status: 'coming-soon', permissions: [], category: 'DevOps' },
  { id: 'int_supabase', name: 'Supabase', description: 'Database and backend infrastructure.', icon: 'database', status: 'coming-soon', permissions: [], category: 'Infrastructure' },
  { id: 'int_whatsapp', name: 'WhatsApp', description: 'Message through supported official methods.', icon: 'message-circle', status: 'coming-soon', permissions: [], category: 'Communication' },
  { id: 'int_browser', name: 'Browser', description: 'Allow Sapphire to browse the web on your behalf.', icon: 'globe', status: 'disconnected', permissions: ['Navigate pages', 'Extract content'], category: 'Automation' },
];

// ── Permissions ───────────────────────────────────────────────────────────────

export const permissionGroups: PermissionGroup[] = [
  {
    id: 'perm_gmail',
    domain: 'Gmail',
    rules: [
      { id: 'pr1', action: 'Read emails', level: 'allowed' },
      { id: 'pr2', action: 'Draft replies', level: 'allowed' },
      { id: 'pr3', action: 'Send emails', level: 'requires-approval' },
    ],
  },
  {
    id: 'perm_files',
    domain: 'Files',
    rules: [
      { id: 'pr4', action: 'Read files', level: 'allowed' },
      { id: 'pr5', action: 'Create files', level: 'allowed' },
      { id: 'pr6', action: 'Delete files', level: 'requires-approval' },
    ],
  },
  {
    id: 'perm_finance',
    domain: 'Financial Actions',
    rules: [
      { id: 'pr7', action: 'Read information', level: 'requires-approval' },
      { id: 'pr8', action: 'Move money', level: 'denied' },
    ],
  },
  {
    id: 'perm_system',
    domain: 'System',
    rules: [
      { id: 'pr9', action: 'Create memories', level: 'allowed' },
      { id: 'pr10', action: 'Delete memories', level: 'requires-approval' },
      { id: 'pr11', action: 'Modify settings', level: 'requires-approval' },
    ],
  },
];

// ── Approvals ─────────────────────────────────────────────────────────────────

export const pendingApprovals: ApprovalRequest[] = [];

// ── Activity ──────────────────────────────────────────────────────────────────

export const activityEvents: ActivityEvent[] = [
  { id: 'act_1', type: 'conversation-created', action: 'Started a new conversation: Sapphire architecture planning', source: 'Conversation', status: 'success', timestamp: '2026-08-28T14:20:00Z' },
  { id: 'act_2', type: 'project-updated', action: 'Updated Project Sapphire progress to 35%', source: 'Projects', status: 'success', timestamp: '2026-08-28T12:00:00Z' },
  { id: 'act_3', type: 'memory-created', action: 'Sapphire remembered: Hotel website project', source: 'Memory', status: 'success', timestamp: '2026-08-27T11:30:00Z' },
  { id: 'act_4', type: 'mission-started', action: 'Mission started: Build hotel website', source: 'Mission Control', status: 'info', timestamp: '2026-08-27T09:15:00Z' },
  { id: 'act_5', type: 'goal-updated', action: 'Milestone completed: Application shell', source: 'Goals', status: 'success', timestamp: '2026-08-26T18:00:00Z' },
  { id: 'act_6', type: 'conversation-created', action: 'Started a new conversation: Learning roadmap discussion', source: 'Conversation', status: 'success', timestamp: '2026-08-26T16:00:00Z' },
  { id: 'act_7', type: 'memory-created', action: 'Sapphire remembered: Interest in systems design', source: 'Memory', status: 'success', timestamp: '2026-08-20T00:00:00Z' },
  { id: 'act_8', type: 'system', action: 'Sapphire Founder Edition v0.1 initialized', source: 'System', status: 'info', timestamp: '2026-08-01T00:00:00Z' },
];

// ── Files ─────────────────────────────────────────────────────────────────────

export const files: FileItem[] = [
  { id: 'file_1', name: 'sapphire-architecture.pdf', type: 'PDF', size: '2.4 MB', createdAt: '2026-08-28T10:00:00Z', projectId: 'proj_1', status: 'ready' },
  { id: 'file_2', name: 'hotel-requirements.docx', type: 'Document', size: '340 KB', createdAt: '2026-08-27T09:00:00Z', projectId: 'proj_2', status: 'ready' },
  { id: 'file_3', name: 'systems-design-notes.md', type: 'Markdown', size: '18 KB', createdAt: '2026-08-25T14:00:00Z', projectId: 'proj_3', status: 'ready' },
];

// ── Research ──────────────────────────────────────────────────────────────────

export const researchSessions: ResearchSession[] = [];

// ── Notifications ─────────────────────────────────────────────────────────────

export const notifications: Notification[] = [
  { id: 'n1', type: 'system-alert', title: 'AI layer not connected', body: 'Sapphire is in development mode. Conversation responses will show a development state until an AI provider is connected.', timestamp: '2026-08-28T00:00:00Z', read: false },
  { id: 'n2', type: 'project-update', title: 'Mission in planning', body: 'The "Build hotel website" mission is in the planning phase.', timestamp: '2026-08-27T09:15:00Z', read: true },
];

// ── Roadmap ───────────────────────────────────────────────────────────────────

export const roadmap = [
  { version: 'v0.1', title: 'Conversation Foundation', description: 'Application shell, conversation interface, memory architecture, projects, and goals.', status: 'current' as const },
  { version: 'v0.2', title: 'Persistent Memory', description: 'Connect Supabase for persistent memory, profiles, and conversations.', status: 'upcoming' as const },
  { version: 'v0.3', title: 'Research', description: 'Live web research with sources, citations, and saved sessions.', status: 'upcoming' as const },
  { version: 'v0.4', title: 'Tools', description: 'Connect external tools and integrations with permission controls.', status: 'upcoming' as const },
  { version: 'v0.5', title: 'Voice', description: 'Voice input and output for natural hands-free interaction.', status: 'upcoming' as const },
  { version: 'v1.0', title: 'Mission Control + Agents', description: 'Full multi-agent mission coordination with approvals and automation.', status: 'upcoming' as const },
  { version: 'Long-term', title: 'Personal AI Operating System', description: 'A unified intelligence across web, desktop, and mobile.', status: 'vision' as const },
];

// ── AI Service Abstraction ────────────────────────────────────────────────────
//
// This interface defines the contract between the UI and any future AI provider.
// The UI never imports provider-specific code — it calls this service.
// When a provider is connected, implement this interface and swap the mock.

export interface AIService {
  connected: boolean;
  sendMessage(
    conversationId: string,
    message: string,
    handlers: {
      onThinking?: () => void;
      onChunk?: (chunk: string) => void;
      onComplete?: (fullResponse: string) => void;
      onError?: (error: string) => void;
    },
    signal?: AbortSignal
  ): Promise<void>;
}

// Mock AI service — clearly marked as development-only.
// Returns a development-state message so no fake AI responses are presented as real.
export const mockAIService: AIService = {
  connected: false,
  async sendMessage(
    _conversationId: string,
    _message: string,
    handlers: {
      onThinking?: () => void;
      onChunk?: (chunk: string) => void;
      onComplete?: (fullResponse: string) => void;
      onError?: (error: string) => void;
    },
    signal?: AbortSignal
  ): Promise<void> {
    handlers.onThinking?.();

    await new Promise((resolve) => setTimeout(resolve, 900));
    if (signal?.aborted) return;

    const response = [
      "I'm currently in development mode — the AI layer isn't connected yet.",
      '',
      "This is Sapphire's conversation interface, fully built and ready for streaming responses. Once an AI provider is connected through the Sapphire AI service, I'll be able to respond naturally to everything you say.",
      '',
      "In the meantime, you can explore the memory center, projects, goals, and mission control. The architecture is designed so that connecting the AI is the last step, not the first.",
    ].join('\n');

    // Simulate streaming so the UI architecture is exercised
    const words = response.split(' ');
    let accumulated = '';
    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) return;
      await new Promise((r) => setTimeout(r, 30));
      accumulated += (i > 0 ? ' ' : '') + words[i];
      handlers.onChunk?.(accumulated);
    }
    handlers.onComplete?.(response);
  },
};

export const aiService: AIService = mockAIService;
