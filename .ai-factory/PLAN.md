# Implementation Plan: Core Domain Model

Branch: none
Created: 2026-03-11

## Settings
- Testing: yes
- Logging: verbose
- Docs: yes

## Roadmap Linkage
Milestone: "Core Domain Model"
Rationale: This plan directly targets the next unchecked roadmap milestone named in the request.

## Commit Plan
- **Commit 1** (after tasks 1-3): `feat: add core workflow domain contracts and schema`
- **Commit 2** (after tasks 4-6): `feat: implement domain services and repositories`
- **Commit 3** (after tasks 7-8): `test: cover core domain model workflows`

## Tasks

### Phase 1: Domain and Persistence Foundation
- [x] Task 1: Define the core domain contracts and invariants across the modular monolith.
  Deliverable: Introduce explicit entities, value objects, enums, policies, and repository interfaces for projects, blocks, dependencies, assignments, comments, and status history so the domain layer no longer consists of empty placeholders.
  Files: `src/modules/projects/domain/*`, `src/modules/blocks/domain/*`, `src/modules/graph/domain/*`, `src/modules/assignments/domain/*`, `src/modules/comments/domain/*`, `src/shared/domain/*`, `src/modules/*/index.ts`.
  Logging requirements: Keep pure domain objects log-free; document where application callers must emit `DEBUG` logs for invariant evaluation inputs, `WARN` logs for rejected commands, and `ERROR` logs only when unexpected state escapes the domain boundary.
  Dependencies: none.

- [x] Task 2: Add the relational data model in Prisma for the new domain modules.
  Deliverable: Extend `prisma/schema.prisma` with normalized models, relations, enums, indexes, and delete/update behavior for projects, blocks, dependency edges, assignments, comments, and status history; generate the first migration for this milestone.
  Files: `prisma/schema.prisma`, `prisma/migrations/*`.
  Logging requirements: Reuse the existing Prisma logger and ensure later repository implementations can log schema-backed read/write intent at `DEBUG`, successful writes at `INFO`, rejected uniqueness or integrity conditions at `WARN`, and persistence failures at `ERROR` without exposing connection secrets.
  Dependencies: depends on Task 1 so the schema reflects the domain terminology and invariants.

- [x] Task 3: Implement Prisma-backed repositories and mappers for projects and blocks.
  Deliverable: Create infrastructure adapters that map Prisma records to domain models and persist project/block aggregates without leaking Prisma types into the application or presentation layers.
  Files: `src/modules/projects/infrastructure/*`, `src/modules/blocks/infrastructure/*`, `src/shared/db/*`, `src/modules/projects/index.ts`, `src/modules/blocks/index.ts`.
  Logging requirements: Add verbose repository logs for method entry, lookup criteria, transaction boundaries, and write outcomes; use `WARN` for missing records or optimistic validation failures and `ERROR` for database exceptions.
  Dependencies: depends on Tasks 1-2.

### Phase 2: Domain Services and Cross-Module Workflows
- [x] Task 4: Implement graph dependency services and status-history recording rules.
  Deliverable: Add application services and domain policies that create/remove dependency edges, prevent self-dependencies and cycles, and record block status transitions with explicit history entries and validation messages.
  Files: `src/modules/graph/application/*`, `src/modules/graph/domain/*`, `src/modules/blocks/application/*`, `src/modules/blocks/domain/*`, `src/modules/graph/infrastructure/*`, `src/modules/blocks/index.ts`, `src/modules/graph/index.ts`.
  Logging requirements: Emit `DEBUG` logs for graph validation inputs and traversal results, `INFO` logs for accepted dependency/status changes, `WARN` logs for rejected invariants, and `ERROR` logs for transaction failures or inconsistent persistence state.
  Dependencies: depends on Tasks 1-3.

- [x] Task 5: Implement assignment and comment workflows on top of the core aggregates.
  Deliverable: Add repositories, entities, and application services for assigning roles to work, attaching project/block comments, and enforcing ownership/reviewer constraints defined by the domain model.
  Files: `src/modules/assignments/domain/*`, `src/modules/assignments/application/*`, `src/modules/assignments/infrastructure/*`, `src/modules/comments/domain/*`, `src/modules/comments/application/*`, `src/modules/comments/infrastructure/*`, `src/modules/assignments/index.ts`, `src/modules/comments/index.ts`.
  Logging requirements: Emit `DEBUG` logs for command inputs and permission checks, `INFO` logs for created assignments/comments, `WARN` logs for invalid actor-role combinations or missing targets, and `ERROR` logs for persistence failures.
  Dependencies: depends on Tasks 1-3 and should reuse Task 4 status and graph terminology.

- [x] Task 6: Add application-level composition points and read models for the upcoming workspace shell.
  Deliverable: Expose stable service factories, DTO/read-model builders, and module exports so later routes and UI work can query projects, blocks, dependency summaries, assignees, comments, and status history without reaching into infrastructure details.
  Files: `src/modules/projects/application/*`, `src/modules/blocks/application/*`, `src/modules/graph/application/*`, `src/modules/assignments/application/*`, `src/modules/comments/application/*`, `src/modules/index.ts`, `src/modules/views/application/*`.
  Logging requirements: Use `DEBUG` for service entry and output shaping, `INFO` for successful aggregate/query assembly, `WARN` for degraded or partial data conditions, and `ERROR` when orchestration fails across module boundaries.
  Dependencies: depends on Tasks 3-5.

### Phase 3: Verification and Documentation
- [x] Task 7: Add unit and integration coverage for the core domain model milestone.
  Deliverable: Cover domain invariants, repository mappings, graph validation, assignment/comment workflows, and status-history behavior with focused unit tests plus integration tests that exercise the application services and Prisma-backed persistence boundaries.
  Files: `tests/unit/modules/**/*`, `tests/integration/modules/**/*`, `tests/setup/*`, and any supporting test fixtures required for Prisma-backed scenarios.
  Logging requirements: Assert behavior instead of log content, but keep test execution compatible with verbose runtime logging; add targeted test helpers only where they reduce noisy setup, and ensure failure paths covered by `WARN`/`ERROR` branches are exercised.
  Dependencies: depends on Tasks 1-6.

- [x] Task 8: Update developer documentation for the new domain model baseline.
  Deliverable: Document the new modules, Prisma migration workflow, and expected boundaries for domain/application/infrastructure code so follow-on milestones build on the same vocabulary and constraints.
  Files: `README.md`, `docs/setup.md`, `AGENTS.md`, and any `.ai-factory` docs that need milestone-level clarification without duplicating existing architecture guidance.
  Logging requirements: Document the expected logging behavior for new services and repositories, including the meaning of `DEBUG`, `INFO`, `WARN`, and `ERROR` events around domain mutations.
  Dependencies: depends on Tasks 1-7 so the documentation reflects the implemented design.
