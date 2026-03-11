# Project Roadmap

> Build CommandMethod: a visual system for team software delivery built around graph-based project planning, responsibilities, and execution visibility.

## Milestones

- [x] **Product Discovery and AI Context** — capture the product vision, recommended stack, architecture pattern, AI agent map, and baseline MCP configuration
- [x] **Foundation App Setup** — initialize the product application with Next.js, TypeScript, Prisma, PostgreSQL, auth baseline, and the modular monolith structure from the architecture guide
- [x] **Core Domain Model** — implement projects, blocks, dependencies, roles, comments, status history, and graph invariants as explicit domain modules
- [ ] **Project Workspace Shell** — deliver the authenticated workspace layout with navigation, project selection, and the base canvas/sidebar composition
- [ ] **Flow Canvas MVP** — render project maps with start/end anchors, block nodes, dependency edges, zooming, selection, and branch visualization
- [ ] **Block Editor and Validation** — support creating and editing blocks with required metadata, DoD, owners, blockers, and server-side validation rules
- [ ] **Status Lifecycle and Readiness Logic** — implement status transitions, blocked state handling, automatic readiness detection, and parent/child progress propagation
- [ ] **Auto-Layout and Graph Integrity** — add deterministic layout recalculation, cycle prevention, merge-point handling, and reliable graph updates after edits
- [ ] **Team Collaboration Features** — add assignments, comments, activity history, audit trail, and “my work” visibility for team usage
- [ ] **Alternative Views and Filters** — introduce kanban, responsibility, timeline, and filtered views for blocked, review, and assigned work
- [ ] **Project Health Insights** — surface bottlenecks, overloaded owners, blocked branches, deadline pressure, and ready-to-start work
- [ ] **Quality and Delivery Hardening** — add tests for graph/domain logic, observability, autosave, error handling, and deployment-ready operational safeguards
- [ ] **Post-MVP Integrations and Realtime** — extend the platform with GitHub, Jira, Figma, and realtime collaborative editing after the core workflow is stable

## Completed

| Milestone | Date |
|-----------|------|
| Product discovery and AI project context | 2026-03-10 |
| Foundation App Setup | 2026-03-10 |
| Core Domain Model | 2026-03-11 |
