# Sapphire Security Architecture

## Principles

- No API keys in frontend source code
- No secrets exposed to the browser
- User remains in control of all consequential actions
- Memory is transparent and user-controllable
- Sapphire is not surveillance, advertising, or manipulation

## Permission System

Four permission levels across domains:

| Level | Meaning |
|-------|---------|
| Allowed | Sapphire can do this freely |
| Requires approval | Sapphire asks before acting |
| Denied | Sapphire cannot do this |

### Example Domains

- **Gmail**: Read (allowed), Draft (allowed), Send (requires approval)
- **Files**: Read (allowed), Create (allowed), Delete (requires approval)
- **Financial**: Read (requires approval), Move money (denied)

## Approval System

When Sapphire wants to perform an important action, the `ApprovalModal` component shows:
- The action to be performed
- The reason
- Additional detail
- Approve / Cancel buttons

No consequential action executes without explicit user confirmation.

## Future Security

- Authentication (v0.2)
- Row-level security on all database tables
- Rate limiting
- Secure sessions
- Audit logging
- Server-side validation of all inputs
