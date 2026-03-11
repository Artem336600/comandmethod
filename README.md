# CommandMethod

CommandMethod is a graph-first workspace for team software delivery. The product shows project flow,
dependencies, ownership, blockers, and execution state as one connected system instead of a flat
ticket board.

## Current Status

This repository currently contains the foundation application setup, the core domain model slice, and the first authenticated workspace shell baseline:

- Next.js application in the workspace root
- Typed environment and runtime configuration
- Security middleware and health endpoint
- Prisma/PostgreSQL schema for projects, blocks, dependencies, assignments, comments, and status history
- Modular monolith domain, application, and infrastructure modules for the core workflow model
- Marketing routes plus authenticated workspace shell routes for `/projects` and `/projects/[projectSlug]`
- Baseline signed-session auth flow
- Project selection, workspace rail/sidebar/canvas placeholder composition, and shell view-model services
- Unit and integration coverage for domain invariants, mappers, workflow services, and workspace shell rendering

## Quick Start

1. Copy `.env.example` to `.env`
2. Update `DATABASE_URL`
3. Replace `SESSION_SECRET` with a long random value
4. Install dependencies
5. Start the app

```bash
npm install
npm run prisma:generate
npm run dev
```

Open `http://localhost:3000`, then use `/sign-in` to create a development session and access `/projects`. The workspace entry now redirects to the first accessible project slug when available and renders the shell empty state otherwise.

## Core Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
npm run prisma:generate
npm run prisma:migrate:dev
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `APP_NAME` | Product name used in runtime metadata |
| `APP_URL` | Canonical application URL |
| `LOG_LEVEL` | `debug`, `info`, `warn`, or `error` |
| `DATABASE_URL` | PostgreSQL connection string for Prisma |
| `SESSION_SECRET` | Secret used to sign auth sessions |
| `ENABLE_SECURE_COOKIES` | Use secure cookies and HSTS in secure environments |
| `PLAYWRIGHT_BASE_URL` | Base URL used by Playwright e2e tests |

## Logging

The codebase uses a structured logger with configurable levels via `LOG_LEVEL`.

- `debug` for request flow, module entry points, and diagnostics
- `info` for major lifecycle events and successful state transitions
- `warn` for authorization denials, invalid sessions, and degraded conditions
- `error` for configuration, persistence, and runtime failures

Logs must never include secrets, raw credentials, or full connection strings.

## Testing Notes

- `test:unit` covers small pure logic checks
- `test:integration` covers module-level behavior with application boundaries and in-memory workflow orchestration
- `test:e2e` is configured with Playwright, but browsers may still need to be installed in a fresh environment
- `PLAYWRIGHT_BASE_URL` can point Playwright at a non-default local server when needed

## Core Domain Model

The current milestone adds explicit domain modules and persistence artifacts for:

- projects and workspace membership summaries
- blocks, definition of done, blockers, and status history
- graph dependencies with cycle-prevention services
- assignments with audit history
- project/block comments

Important implementation entry points:

- `prisma/schema.prisma` and `prisma/migrations/202603110001_core_domain_model/migration.sql`
- `src/modules/*/domain/*` for entities, policies, and repository contracts
- `src/modules/*/infrastructure/*` for Prisma mappers and repositories
- `src/modules/views/application/workspace-read-services.ts` for the workspace read-model composition layer

## Project Workspace Shell

The current workspace milestone adds the first real authenticated project shell:

- `/projects` resolves the signed-in member's accessible projects and redirects to `/projects/[projectSlug]` when a default project exists
- `/projects/[projectSlug]` renders the selected-project workspace shell with a project rail, summary sidebar, and canvas placeholder stage
- `src/modules/views/application/workspace-shell-view-model-service.ts` builds the shell view model from session access, project summaries, and one active project snapshot
- `src/modules/projects/application/resolve-workspace-project-selection.ts` centralizes slug selection and redirect behavior

Important implementation entry points:

- `app/(workspace)/projects/workspace-shell-data.ts`
- `app/(workspace)/projects/page.tsx`
- `app/(workspace)/projects/[projectSlug]/page.tsx`
- `src/modules/views/presentation/workspace-project-shell-view.tsx`

## Documentation

- Setup details: `docs/setup.md`
- AI project description: `.ai-factory/DESCRIPTION.md`
- Architecture rules: `.ai-factory/ARCHITECTURE.md`
- Roadmap: `.ai-factory/ROADMAP.md`
