# CommandMethod

CommandMethod is a graph-first workspace for team software delivery. The product shows project flow,
dependencies, ownership, blockers, and execution state as one connected system instead of a flat
ticket board.

## Current Status

This repository currently contains the foundation application setup:

- Next.js application in the workspace root
- Typed environment and runtime configuration
- Security middleware and health endpoint
- Prisma/PostgreSQL foundation
- Modular monolith folder skeleton
- Marketing and workspace route shells
- Baseline signed-session auth flow
- Unit, integration, and e2e test tooling baseline

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

Open `http://localhost:3000`, then use `/sign-in` to create a development session and access `/projects`.

## Core Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
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
- `test:integration` covers module-level behavior with application boundaries
- `test:e2e` is configured with Playwright, but browsers may still need to be installed in a fresh environment
- `PLAYWRIGHT_BASE_URL` can point Playwright at a non-default local server when needed

## Documentation

- Setup details: `docs/setup.md`
- AI project description: `.ai-factory/DESCRIPTION.md`
- Architecture rules: `.ai-factory/ARCHITECTURE.md`
- Roadmap: `.ai-factory/ROADMAP.md`
