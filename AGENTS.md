# AGENTS.md

> Project map for AI agents. Keep this file up-to-date as the project evolves.

## Project Overview
This workspace now contains the discovery artifacts, the runnable product foundation, the Core Domain Model baseline, and the first authenticated Project Workspace Shell milestone for CommandMethod. The original product definition lives in `comandmethod/idea.md`, while the application code lives in the workspace root under `app/`, `src/`, `prisma/`, `tests/`, and `docs/`.

## Tech Stack
- **Language:** TypeScript
- **Framework:** Next.js
- **Database:** PostgreSQL
- **ORM:** Prisma

## Project Structure
```text
.
|- .codex/                  local Codex skills used to manage project workflows
|- .ai-factory/             generated AI project context and architecture docs
|- app/                     Next.js App Router entry points, route groups, and API routes
|- src/                     modular monolith code: domain, application, infrastructure, UI, and server adapters
|- prisma/                  Prisma schema and migrations for the core domain model
|- tests/                   unit, integration, and e2e test suites plus in-memory test doubles
|- docs/                    developer-facing setup documentation
|- README.md                root project quick-start and command reference
|- middleware.ts            request security headers and workspace auth gate
|- package.json             root runtime and tooling scripts
|- ai-factory/              upstream AI Factory toolkit repository kept in the workspace
|- comandmethod/            product discovery materials for this project
|  \- idea.md               main product concept and MVP definition
|- .mcp.json                project-level MCP server configuration
\- .ai-factory.json         local AI Factory configuration file
```

## Key Entry Points
| File | Purpose |
|------|---------|
| comandmethod/idea.md | Source product idea and scope for the planned application |
| .ai-factory/DESCRIPTION.md | Project specification, recommended stack, and non-functional requirements |
| .ai-factory/ARCHITECTURE.md | Architecture pattern, module boundaries, and development rules |
| app/(marketing)/page.tsx | Marketing landing page for the product shell |
| app/(workspace)/layout.tsx | Authenticated workspace layout wrapper |
| app/(workspace)/projects/page.tsx | Workspace entry route that resolves and redirects to the selected project shell |
| app/(workspace)/projects/[projectSlug]/page.tsx | Selected-project workspace shell route with project rail, sidebar, and canvas placeholder |
| app/api/auth/sign-in/route.ts | Development sign-in endpoint that issues a signed session cookie |
| app/api/health/route.ts | Health endpoint for runtime checks |
| src/shared/auth/session.ts | Session token creation and verification |
| src/shared/db/prisma.ts | Shared Prisma client singleton and connection verification |
| prisma/schema.prisma | Canonical Prisma schema for projects, blocks, dependencies, assignments, comments, and status history |
| prisma/migrations/202603110001_core_domain_model/migration.sql | Initial SQL migration for the Core Domain Model milestone |
| src/modules/projects/domain/project.ts | Project aggregate rules, lifecycle, and anchor validation |
| src/modules/blocks/domain/block.ts | Block aggregate rules for owner, DoD, blockers, and status lifecycle |
| src/modules/graph/application/create-block-dependency-service.ts | Server-side dependency creation with duplicate/cycle prevention |
| src/modules/assignments/application/assign-role-service.ts | Assignment workflow with audit-history creation |
| src/modules/comments/application/add-comment-service.ts | Project/block comment creation workflow |
| src/modules/views/application/workspace-read-services.ts | Composition layer for workspace read models and project snapshots |
| src/modules/views/application/workspace-shell-view-model-service.ts | Workspace shell orchestration for selection, redirect state, and active project composition |
| src/modules/views/presentation/workspace-project-shell-view.tsx | Selected-project workspace UI with navigation rail, sidebar, and canvas placeholder |
| middleware.ts | Security headers and workspace session gate |
| .mcp.json | MCP server configuration for Postgres and Playwright |
| .ai-factory.json | Local AI Factory configuration for this workspace |

## Documentation
| Document | Path | Description |
|----------|------|-------------|
| Product idea | comandmethod/idea.md | Full product concept, domain model, risks, and MVP scope |
| Root README | README.md | Quick start, core commands, env vars, and current foundation status |
| Setup guide | docs/setup.md | Local environment, Prisma workflow, auth baseline, and quality checks |
| AI Factory docs | ai-factory/README.md | Documentation for the bundled AI Factory toolkit |

## AI Context Files
| File | Purpose |
|------|---------|
| AGENTS.md | This file — project structure map |
| .ai-factory/DESCRIPTION.md | Project specification and tech stack |
| .ai-factory/ARCHITECTURE.md | Architecture decisions and guidelines |
| .ai-factory/ROADMAP.md | Milestones and implementation order |
| .ai-factory/RULES.md | Project-specific implementation rules |
| .ai-factory/SECURITY.md | Security checklist ignore registry |
| .mcp.json | Project-level MCP configuration |
