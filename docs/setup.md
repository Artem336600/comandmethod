# Local Setup

## Prerequisites

- Node.js 22+
- PostgreSQL 15+ (or compatible managed instance)

## Environment

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to your local or shared PostgreSQL instance.
3. Replace `SESSION_SECRET` with a long random value before any shared deployment.
4. Set `PLAYWRIGHT_BASE_URL` if e2e tests should target a non-default local URL.

## Database Workflow

Use the Prisma commands from the root package:

```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
```

Current schema is intentionally minimal. Domain tables will be introduced in the next milestone.

## Authentication Baseline

- The current auth flow is a development bootstrap, not a production identity system.
- Open `/sign-in` and submit the form to receive a signed session cookie.
- Workspace routes under `/projects` require an active session and will redirect to `/sign-in` when missing.
- Session cookies are signed with `SESSION_SECRET`.

## Logging

- `LOG_LEVEL=debug` for verbose local diagnostics
- `LOG_LEVEL=info` for normal development
- `LOG_LEVEL=warn` or `error` to reduce noise

Key runtime logs currently include:

- config load summary
- middleware request entry and workspace access decisions
- health endpoint checks
- Prisma client and connection lifecycle
- auth session issuance and verification

## Quality Checks

Run the local quality baseline before handing work to another contributor:

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration
```

`npm run test:e2e` is configured but may require Playwright browser installation in a fresh machine.
By default it targets `http://127.0.0.1:3000`, or `PLAYWRIGHT_BASE_URL` if provided.
