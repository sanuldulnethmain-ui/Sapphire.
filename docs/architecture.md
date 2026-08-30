# Sapphire System Architecture

## Overview

Sapphire is structured so future capabilities can be added without rebuilding the application.

## Core Modules

### Sapphire Core
The central coordinator. Routes user intent to the appropriate engine, agent, or tool.

### Conversation Engine
Handles natural communication. The UI supports streaming responses, processing states (thinking, researching, using a tool, waiting for approval), and cancellation — even though the AI layer is not yet connected.

### Memory Engine
Stores and retrieves what Sapphire knows about the user. Organized into categories: identity, preferences, goals, projects, interests, experiences, lessons. Includes a consent model (remember automatically, ask before remembering, never remember).

### Mission Control
Coordinates larger tasks using the pipeline: understand → plan → execute → review → approve → report → learn. Agents are assigned per step. Approval is required for consequential actions.

## AI Service Abstraction

```
UI → Sapphire AI Service → Model Provider → Response → UI
```

The UI never imports provider-specific code. The `AIService` interface in `src/lib/data.ts` defines the contract. Swapping providers requires implementing this interface — no UI changes.

## Agent Architecture (Future)

| Agent | Purpose |
|-------|---------|
| Conversation | Human communication |
| Research | Internet research |
| Creator | Content generation |
| Business | Business assistance |
| Computer | Computer interaction |
| Planning | Goal and task planning |
| Automation | Background workflows |
| Trading Research | Market research (research-only, never executes trades) |

## Tool System (Future)

Every tool has: permissions, status, capabilities, risk level, authentication state. Tools pass through the permission/approval architecture before acting.
