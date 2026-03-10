# Implementation Plan: Foundation App Setup

Branch: feature/foundation-app-setup
Created: 2026-03-10

## Settings
- Testing: yes
- Logging: verbose
- Docs: yes

## Roadmap Linkage
Milestone: "Foundation App Setup"
Rationale: This plan establishes the application skeleton, infrastructure, and engineering guardrails required before domain modules and parallel delivery can begin.

## Implementation Notes
- Scope target is the new product application in the workspace root.
- The nested `ai-factory/` directory is reference tooling and should remain untouched unless a task explicitly says otherwise.
- All new product code should follow the modular monolith structure from `.ai-factory/ARCHITECTURE.md`.

## Commit Plan
- **Commit 1** (after tasks 1-3): `feat: bootstrap nextjs app foundation`
- **Commit 2** (after tasks 4-6): `feat: add architecture skeleton and auth baseline`
- **Commit 3** (after tasks 7-8): `chore: add testing docs and verification guards`

## Tasks

### Phase 1: Product Bootstrap

- [x] **Task 1: Initialize the root application runtime and toolchain**
  Deliverable: create the base Next.js + TypeScript application in the workspace root, with package scripts and framework config ready for local development.
  Files: `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`, `src/shared/lib/`
  Logging requirements: add an environment-driven logger entry point in `src/shared/lib/` and log application boot/config load at `DEBUG`, major startup milestones at `INFO`, and configuration failures at `ERROR`.

- [x] **Task 2: Add environment, configuration, and security baseline**
  Deliverable: define typed environment loading and the first security defaults for the web app before feature work starts.
  Files: `.env.example`, `src/shared/lib/env.ts`, `src/shared/lib/config.ts`, `middleware.ts`, `app/api/health/route.ts`
  Logging requirements: log missing or invalid environment variables at `ERROR`, request entry/exit for health and middleware boundaries at `DEBUG`, and startup configuration summary without secrets at `INFO`.

- [x] **Task 3: Set up the database foundation with Prisma and PostgreSQL**
  Deliverable: create the initial Prisma configuration, database client wiring, and a safe migration workflow stub for later domain modules.
  Files: `prisma/schema.prisma`, `src/shared/db/prisma.ts`, `src/shared/db/index.ts`, `README.md` or `docs/setup.md`
  Logging requirements: log Prisma client lifecycle and connection attempts at `DEBUG`, successful database initialization at `INFO`, and connection or migration failures at `ERROR` without exposing secrets.

### Phase 2: Architecture Skeleton

- [x] **Task 4: Create the modular monolith directory skeleton and public module boundaries**
  Deliverable: scaffold the planned module layout so later work lands in the correct folders with clear exports and ownership boundaries.
  Files: `src/modules/projects/`, `src/modules/blocks/`, `src/modules/graph/`, `src/modules/assignments/`, `src/modules/comments/`, `src/modules/views/`, `src/shared/`, `src/server/`, module `index.ts` files
  Logging requirements: add logger placeholders and conventions for module entry points; log cross-module orchestration only at application-service boundaries, not inside pure domain objects.

- [x] **Task 5: Build the first product shell for marketing and authenticated workspace routes**
  Deliverable: create the initial route groups and layouts for public pages and the future workspace so the project has stable entry points.
  Files: `app/(marketing)/page.tsx`, `app/(workspace)/layout.tsx`, `app/(workspace)/projects/page.tsx`, `src/shared/ui/`, `src/modules/views/presentation/`
  Logging requirements: log page-level data loading boundaries at `DEBUG`, major navigation/session gate events at `INFO`, and unexpected rendering or data failures at `ERROR`.

- [x] **Task 6: Add the authentication and authorization baseline**
  Deliverable: implement a minimal auth foundation and workspace protection strategy suitable for later RBAC and audit requirements.
  Files: `src/shared/auth/`, `middleware.ts`, `app/api/auth/`, `src/shared/domain/`, `src/modules/projects/application/`
  Logging requirements: log auth flow checkpoints, session validation, and authorization denials with request context at `INFO/WARN`; log failures and invalid tokens at `ERROR`; never log secrets or raw credentials.

### Phase 3: Delivery Guardrails

- [x] **Task 7: Add testing and quality tooling baseline**
  Deliverable: wire up unit, integration, and e2e test runners plus lint/typecheck commands so future milestones have enforceable feedback loops.
  Files: `vitest.config.ts` or `jest.config.ts`, `playwright.config.ts`, `tests/unit/`, `tests/integration/`, `tests/e2e/`, package scripts
  Logging requirements: test helpers should support verbose debug output when `LOG_LEVEL=DEBUG`; failed test setup and integration environment issues must emit actionable `ERROR` logs.

- [x] **Task 8: Document local setup and delivery conventions**
  Deliverable: document how to run the app, database, tests, and required environment variables so implementation can scale to parallel contributors.
  Files: `README.md` and/or `docs/setup.md`, `.ai-factory/AGENTS` references only if needed for factual updates
  Logging requirements: document log levels, where logs appear, and which startup/runtime events must always be logged during development.
