# Project: CommandMethod

## Overview
CommandMethod is a visual system for team software delivery where a project is represented as a directed graph of stages, dependencies, parallel workstreams, responsibilities, and completion criteria. Instead of managing development as a flat task list, the product gives teams a live map of how work moves from project start to release.

## Core Features
- Visual flow view with start and finish anchors
- Graph-based blocks with dependencies, parallel branches, and cycle prevention
- Rich block cards with owners, assignees, reviewers, blockers, links, and definition of done
- Status lifecycle with validation and automatic readiness detection
- Team views for responsibility, kanban, timeline, and filtered workspaces
- Project health insights such as bottlenecks, blocked branches, and readiness to start

## Tech Stack
- **Language:** TypeScript
- **Framework:** Next.js (React, App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Signed cookie sessions with JOSE (baseline)
- **Logging:** Structured application logger with environment-driven log levels
- **Realtime:** WebSocket-based collaboration layer for later iterations
- **Primary UI Libraries:** React Flow for graph interaction, Tailwind CSS for product UI
- **Integrations:** GitHub, Jira, Figma (post-MVP)

## Architecture Notes
- Start as a modular monolith to keep delivery speed high while preserving clear module boundaries.
- Separate graph domain logic from UI rendering so layout, validation, and dependency rules stay testable.
- Treat projects, blocks, dependencies, assignments, comments, and status history as first-class domain modules.
- Keep auto-layout, graph validation, and status propagation deterministic and server-validated.
- Design the API to support future realtime collaboration and external integrations without forcing microservices early.

## Non-Functional Requirements
- Logging: Configurable via `LOG_LEVEL` with structured application and audit logs
- Error handling: Structured API errors with domain-specific validation messages
- Security: Role-based access control, protected write operations, audit trail for status and assignment changes
- Data integrity: No dependency cycles, explicit blocker reasons, mandatory owner and definition-of-done for active blocks
- Performance: Responsive canvas interaction for large project maps and predictable layout recalculation
- Reliability: Autosave, optimistic UI with rollback, and history tracking for critical mutations

## Architecture
See `.ai-factory/ARCHITECTURE.md` for detailed architecture guidelines.
Pattern: Modular Monolith
