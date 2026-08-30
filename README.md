# 💎 Sapphire

### Your personal AI operating system.

**By Your Side.**

---

## What is Sapphire

Sapphire is a personal AI operating system and intelligent companion. It is not a generic chatbot — it is designed to understand its user, communicate naturally, remember meaningful information, help solve problems, coordinate tools, and eventually operate across the user's digital world with explicit permission.

This repository contains **Sapphire Founder Edition v0.1** — the first interface to a much larger system.

## Current Version

**Founder Edition v0.1**

- Audience: Founder / User #000001
- Platform: Web browser (desktop primary, responsive to mobile)
- Status: Prototype

## Vision

Sapphire should eventually become the user's:

- Companion
- Second brain
- Research assistant
- Creative partner
- Productivity assistant
- Project manager
- Technical assistant
- Business assistant
- Automation layer
- Interface to digital tools

## Technology Stack

- **TypeScript** — strict type safety across the entire application
- **React 18** — component-based UI architecture
- **Vite** — fast build tooling and lazy-loaded views
- **Tailwind CSS** — custom design system with sapphire/aqua color ramps
- **Lucide React** — icon system
- **Supabase** — planned for auth, database, memory, and storage (v0.2)

## Local Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Production build
npm run typecheck # Type checking
npm run lint     # ESLint
```

## Architecture Overview

```
sapphire/
├── src/
│   ├── App.tsx                  # Application shell, routing, keyboard shortcuts
│   ├── config/
│   │   └── navigation.ts        # Sidebar navigation configuration
│   ├── lib/
│   │   ├── data.ts              # Data-access layer (mock v0.1, swap for Supabase)
│   │   └── utils.ts             # Shared utilities
│   ├── types/
│   │   └── index.ts             # Domain types (map to future PostgreSQL schema)
│   ├── components/
│   │   ├── ui/                  # Reusable design system (Button, Card, Modal, etc.)
│   │   ├── layout/              # Shell components (Sidebar, TopBar, CommandPalette)
│   │   └── shared/              # Cross-cutting components (ApprovalModal)
│   └── views/                   # Application screens
│       ├── HomeView.tsx         # Command Center
│       ├── ConversationView.tsx # AI conversation interface (centerpiece)
│       ├── MemoryView.tsx       # Memory center
│       ├── ProjectsView.tsx     # Projects + project detail
│       ├── GoalsView.tsx        # Goals with milestones
│       ├── MissionsView.tsx     # Mission Control prototype
│       ├── ResearchView.tsx     # Research workspace (dev state)
│       ├── CreatorView.tsx      # Creator workspace (dev state)
│       ├── FilesView.tsx        # File management (dev state)
│       ├── IntegrationsView.tsx # Integration management
│       ├── ActivityView.tsx     # Activity timeline
│       └── SettingsView.tsx     # Settings, permissions, about, roadmap
```

### Conceptual Architecture

```
                    SAPPHIRE
                       │
                  Sapphire Core
                       │
        ┌──────────────┼──────────────┐
        │              │              │
 Conversation       Memory         Mission
    Engine          Engine          Control
        │              │              │
        └──────────────┼──────────────┘
                       │
                    AI Layer
                       │
                  Tool System
                       │
                External Services
```

### Data Access Layer

All data flows through `src/lib/data.ts`. This module currently provides clearly-marked mock/development data. When Supabase is connected, these functions will be replaced with real database queries — components import from this layer, so the swap is seamless.

### AI Service Abstraction

The UI never contains provider-specific code. It calls the `AIService` interface defined in `src/lib/data.ts`. When an AI provider is connected, implement this interface and swap the mock — no UI changes required.

## Development States

Sapphire v0.1 is honest about what works and what doesn't:

- **Conversation**: UI is fully built with streaming architecture. AI layer is not connected — responses show a development state.
- **Memory**: Full CRUD interface with categories, search, consent controls. Not yet persistent.
- **Projects & Goals**: Full UI with tasks, milestones, progress. Not yet persistent.
- **Missions**: Prototype interface showing the future agent coordination flow.
- **Research, Creator, Files**: Structured UI with clear "development mode" states.
- **Integrations**: All show as disconnected — none are falsely presented as connected.

## Security Principles

- No API keys in frontend source code
- No secrets exposed to the browser
- Permission system designed from the beginning (Read / Write / Execute / Critical)
- Approval system for consequential actions
- Memory is transparent — user can inspect, correct, and delete
- Sapphire is not a surveillance tool, advertising platform, or manipulative assistant

## Roadmap

| Version | Focus |
|---------|-------|
| v0.1 | Conversation foundation (current) |
| v0.2 | Persistent memory (Supabase) |
| v0.3 | Research |
| v0.4 | Tools & integrations |
| v0.5 | Voice |
| v1.0 | Mission Control + agents |
| Long-term | Personal AI operating system |

## Design Language

- Deep dark interface with sapphire-blue and cyan accents
- Glass-like surfaces with subtle gradients
- Restrained glow, elegant borders, soft shadows
- Inter typeface with JetBrains Mono for code
- 8px spacing system
- Subtle animations with reduced-motion support
- Fully responsive: desktop, laptop, tablet, mobile

## Versioning

Sapphire Founder Edition v0.1. Prepared for future v0.2 → v1.0 → v5.0.

---

**Sapphire. By Your Side.**
