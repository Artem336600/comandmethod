# AGENTS.md

> Project map for AI agents. Keep this file up-to-date as the project evolves.

## Project Overview
This workspace now contains both the discovery artifacts and the first runnable product foundation for CommandMethod, a visual system for team software delivery. The original product definition lives in `comandmethod/idea.md`, while the application code lives in the workspace root under `app/`, `src/`, `prisma/`, `tests/`, and `docs/`.

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
|- src/                     modular monolith code: modules, shared services, server adapters
|- prisma/                  Prisma schema and database foundation
|- tests/                   unit, integration, and e2e test suites
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
| app/(workspace)/projects/page.tsx | Current workspace entry route for project work |
| app/api/auth/sign-in/route.ts | Development sign-in endpoint that issues a signed session cookie |
| app/api/health/route.ts | Health endpoint for runtime checks |
| src/shared/auth/session.ts | Session token creation and verification |
| src/shared/db/prisma.ts | Shared Prisma client singleton and connection verification |
| middleware.ts | Security headers and workspace session gate |
| .mcp.json | MCP server configuration for Postgres and Playwright |
| .ai-factory.json | Local AI Factory configuration for this workspace |

## Documentation
| Document | Path | Description |
|----------|------|-------------|
| Product idea | comandmethod/idea.md | Full product concept, domain model, risks, and MVP scope |
| Root README | README.md | Quick start, core commands, env vars, and current foundation status |
| Setup guide | docs/setup.md | Local environment, database, auth baseline, and quality checks |
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
