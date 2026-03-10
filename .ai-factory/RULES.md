# Project Rules

> Short, actionable rules and conventions for this project. Loaded automatically by $aif-implement.

## Rules

- All graph invariants must be validated on the server, not only in the client UI.
- Block titles must describe a completed result, not an activity.
- A block must not leave `Draft` without an owner, expected result, and definition of done.
- `Blocked` status requires a blocker reason, blocking source, and explicit unblock condition.
- All dependency creation and updates must go through graph domain services with cycle prevention.
- UI components must not contain workflow rules, status propagation logic, or dependency validation.
- Feature modules may communicate only through application services or explicit module contracts.
- Prisma models must never be exposed directly to UI components or public API responses.
- Every status change and assignment change must create an audit/history entry.
- Auto-layout must be deterministic and derived from graph state, not treated as the source of truth.
