# Implementation Plan: Project Workspace Shell

Branch: none
Created: 2026-03-11

## Settings
- Testing: yes
- Logging: verbose
- Docs: yes

## Roadmap Linkage
Milestone: "Project Workspace Shell"
Rationale: This plan targets the next unchecked roadmap milestone and turns the current authenticated `/projects` stub into a real workspace shell with project selection and base canvas/sidebar composition.

## Commit Plan
- **Commit 1** (after tasks 1-3): `feat(workspace): add project selection and shell routing`
- **Commit 2** (after tasks 4-5): `feat(workspace): compose workspace shell views`
- **Commit 3** (after tasks 6-7): `test(workspace): cover workspace shell flows`

## Tasks

### Phase 1: Data Flow and Route Foundation
- [x] Task 1: Add workspace selection and active-project view-model services.
  Deliverable: Introduce application-level read models that combine workspace access, member-visible project summaries, selected-project resolution by slug, and one active project snapshot so the shell can render a navigation rail plus one focused workspace without loading every project in full.
  Files: `src/modules/views/application/*`, `src/modules/projects/application/*`, `src/modules/views/application/index.ts`, `src/modules/projects/application/index.ts`.
  Logging requirements: Emit `DEBUG` logs for session/user inputs, selected slug, and query boundaries; `INFO` logs for successful workspace view-model assembly with project and block counts; `WARN` logs for missing accessible projects, inaccessible slugs, or empty-state fallbacks; `ERROR` logs only for unexpected orchestration failures across modules.
  Dependencies: none.

- [x] Task 2: Add project-selection routing for the workspace shell.
  Deliverable: Replace the current placeholder-only `/projects` flow with route behavior that either redirects to the first accessible project or renders a no-project empty state, and add a dedicated selected-project route such as `/projects/[projectSlug]` for stable deep-linking into the workspace shell.
  Files: `app/(workspace)/projects/page.tsx`, `app/(workspace)/projects/[projectSlug]/page.tsx`, `app/(workspace)/layout.tsx`, and any route-local helpers needed under `app/(workspace)/projects/*`.
  Logging requirements: Emit `DEBUG` logs for route resolution and redirect decisions, `INFO` logs for successful selected-project rendering, `WARN` logs for denied or missing projects, and `ERROR` logs only when server-render assembly fails unexpectedly.
  Dependencies: depends on Task 1.

- [x] Task 3: Refactor the workspace shell frame into responsive layout primitives.
  Deliverable: Expand the current `WorkspaceShell` into a real shell frame with top navigation, project switcher slot, sidebar slot, main canvas slot, and mobile-safe stacking behavior while preserving the current authenticated layout entry point.
  Files: `src/modules/views/presentation/workspace-shell.tsx`, `src/modules/views/presentation/*`, `src/shared/ui/*`, `src/modules/views/presentation/index.ts`.
  Logging requirements: Keep presentation components log-free unless they perform server-side view-model shaping; if helper components do shape server data, use `DEBUG` logs for slot/layout inputs and avoid noisy per-render logging in pure UI leaves.
  Dependencies: depends on Task 1 so the shell props match the new workspace view model.

### Phase 2: Workspace Composition
- [x] Task 4: Build the project rail, sidebar panels, and canvas placeholder views.
  Deliverable: Add intentional presentation components for project navigation, current project summary, key counts/status indicators, and a base canvas stage placeholder that clearly reserves space for the upcoming flow canvas milestone without embedding graph rules in the UI.
  Files: `src/modules/views/presentation/*`, `src/shared/ui/*`, and any supporting presentation DTO helpers under `src/modules/views/application/*`.
  Logging requirements: Prefer log-free presentational components; keep any server-side DTO shaping logs at `DEBUG`, summarize panel/canvas composition success at `INFO` in the calling application service, and avoid client-side console noise.
  Dependencies: depends on Tasks 1-3.

- [x] Task 5: Integrate the new workspace composition into authenticated pages and module exports.
  Deliverable: Wire the selected-project route and layout to the new shell, sidebar, and canvas placeholder components; ensure module exports remain stable; and keep project selection, sign-out, and authenticated navigation working end to end.
  Files: `app/(workspace)/layout.tsx`, `app/(workspace)/projects/page.tsx`, `app/(workspace)/projects/[projectSlug]/page.tsx`, `src/modules/views/index.ts`, `src/modules/views/presentation/index.ts`, and any affected module composition files.
  Logging requirements: Emit `DEBUG` logs for page-level composition inputs, `INFO` logs for successful shell hydration per selected project, `WARN` logs for degraded empty states, and `ERROR` logs for unexpected render-path failures that escape the application layer.
  Dependencies: depends on Tasks 2-4.

### Phase 3: Verification and Documentation
- [x] Task 6: Add unit and integration coverage for workspace selection and shell rendering.
  Deliverable: Cover project-selection routing, empty-state behavior, selected-project view-model assembly, and workspace shell composition with focused unit/integration tests so regressions in redirects, access control, and shell slots are caught before the Flow Canvas milestone.
  Files: `tests/unit/modules/views/**/*`, `tests/unit/modules/projects/**/*`, `tests/integration/modules/views/**/*`, `tests/integration/modules/projects/**/*`, and any shared test helpers in `tests/setup/*`.
  Logging requirements: Do not assert raw log strings; instead exercise success, `WARN`, and failure paths through behavior and keep tests compatible with verbose runtime logging.
  Dependencies: depends on Tasks 1-5.

- [x] Task 7: Update documentation for the workspace-shell baseline.
  Deliverable: Document the new workspace routes, selection behavior, empty-state expectations, and shell composition boundaries so the next milestones can attach canvas interactions and block editing to a stable authenticated shell.
  Files: `README.md`, `docs/setup.md`, `AGENTS.md`, and milestone-tracking docs that need a workspace-shell status update without rewriting architecture guidance.
  Logging requirements: Document expected `DEBUG`/`INFO`/`WARN` semantics for workspace route composition and selected-project loading so follow-on work preserves the same observability pattern.
  Dependencies: depends on Tasks 1-6.
