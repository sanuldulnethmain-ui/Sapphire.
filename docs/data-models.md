# Sapphire Data Models

All types are defined in `src/types/index.ts`. These are designed to map cleanly to a future PostgreSQL/Supabase schema.

## Entities

### User
- id, userNumber, role, name, preferredName, email, timezone
- interests[], communicationPreferences
- createdAt

### Conversation
- id, title, summary, status, messageCount
- createdAt, updatedAt, pinned, projectId

### Message
- id, conversationId, role (user/sapphire)
- content, status (sent/thinking/streaming/complete/error/stopped)
- createdAt, actions[]

### Memory
- id, category, title, content, source
- confidence, important, createdAt, updatedAt

### Project
- id, name, description, status, priority, progress
- goals[], tasks[], notes, createdAt, updatedAt

### Goal
- id, title, description, category, status, progress
- deadline, projectId, milestones[]

### Mission
- id, title, description, status, goalId
- steps[] (phase, status, agentType)

### Agent
- id, type, name, description, status
- capabilities[], riskLevel

### Tool
- id, name, category, status, riskLevel
- authenticated, capabilities[]

### Integration
- id, name, description, icon, status
- permissions[], category

### Permission
- Group → domain (Gmail, Files, Financial, System)
- Rule → action, level (allowed/requires-approval/denied)

### Approval
- id, title, action, reason, domain, riskLevel, detail

### ActivityEvent
- id, type, action, source, status, timestamp

### FileItem
- id, name, type, size, createdAt, projectId, status

### ResearchSession
- id, query, status, sources[], summary

### Notification
- id, type, title, body, timestamp, read

## Supabase Mapping (Future)

Each entity will become a table with RLS policies scoped to `auth.uid()`. The data-access layer in `src/lib/data.ts` will be replaced with Supabase client queries — components won't need changes.
