import { Assignment, AssignmentTarget } from "@/src/modules/assignments/domain";
import { BlockStatusHistoryEntry } from "@/src/modules/blocks/domain";
import { Comment, CommentTarget } from "@/src/modules/comments/domain";
import { BlockDependency } from "@/src/modules/graph/domain";
import { createWorkspaceReadServices } from "@/src/modules/views/application";
import {
  InMemoryAssignmentRepository,
  InMemoryBlockRepository,
  InMemoryBlockStatusHistoryRepository,
  InMemoryCommentRepository,
  InMemoryGraphRepository,
  InMemoryProjectRepository,
  createExecutableBlock,
  createProject
} from "@/tests/setup/module-test-doubles";

describe("BuildWorkspaceShellViewModelService", () => {
  it("should build the active workspace shell for an accessible selected project", async () => {
    const alphaProject = createProject({
      id: "project-1",
      name: "Alpha release",
      slug: "alpha-release",
      startBlockId: "block-1",
      finishBlockId: "block-2"
    });
    const betaProject = createProject({
      id: "project-2",
      name: "Beta workspace",
      slug: "beta-workspace"
    });
    const projects = new InMemoryProjectRepository([alphaProject, betaProject], {
      "user-1": ["project-1", "project-2"]
    });
    const blocks = new InMemoryBlockRepository([
      createExecutableBlock({
        id: "block-1",
        projectId: "project-1",
        title: "Entry path delivered",
        status: "ready"
      }),
      createExecutableBlock({
        id: "block-2",
        projectId: "project-1",
        title: "Release candidate approved",
        status: "done"
      })
    ]);
    const statusHistory = new InMemoryBlockStatusHistoryRepository();
    await statusHistory.append(
      BlockStatusHistoryEntry.create({
        id: "history-1",
        blockId: "block-2",
        fromStatus: "in_review",
        toStatus: "done",
        changedByUserId: "user-1",
        eventType: "status_changed",
        occurredAt: new Date("2026-03-11T11:00:00.000Z")
      })
    );

    const graph = new InMemoryGraphRepository();
    await graph.saveDependency(
      BlockDependency.create({
        id: "dependency-1",
        projectId: "project-1",
        predecessorBlockId: "block-1",
        successorBlockId: "block-2",
        createdAt: new Date("2026-03-11T10:00:00.000Z")
      })
    );

    const assignments = new InMemoryAssignmentRepository([
      Assignment.create({
        id: "assignment-1",
        target: AssignmentTarget.forProject("project-1"),
        role: "lead",
        subjectUserId: "user-1",
        assignedByUserId: "admin-1",
        createdAt: new Date("2026-03-11T09:00:00.000Z")
      }),
      Assignment.create({
        id: "assignment-2",
        target: AssignmentTarget.forBlock("project-1", "block-1"),
        role: "owner",
        subjectUserId: "user-2",
        assignedByUserId: "user-1",
        createdAt: new Date("2026-03-11T09:30:00.000Z")
      })
    ]);
    const comments = new InMemoryCommentRepository([
      Comment.create({
        id: "comment-1",
        target: CommentTarget.forProject("project-1"),
        authorUserId: "user-1",
        body: "Project shell is ready.",
        createdAt: new Date("2026-03-11T09:40:00.000Z")
      }),
      Comment.create({
        id: "comment-2",
        target: CommentTarget.forBlock("project-1", "block-1"),
        authorUserId: "user-2",
        body: "Block is ready to begin.",
        createdAt: new Date("2026-03-11T09:45:00.000Z")
      })
    ]);

    const services = createWorkspaceReadServices({
      projects,
      blocks,
      statusHistory,
      graph,
      assignments,
      comments
    });

    const viewModel = await services.workspaceShellViewModel.execute({
      session: {
        userId: "user-1",
        email: "lead@commandmethod.local",
        displayName: "Lead User",
        roles: ["lead"]
      },
      requestedProjectSlug: "alpha-release"
    });

    expect(viewModel.selection).toMatchObject({
      state: "resolved",
      selectedProjectSlug: "alpha-release",
      redirectToSlug: null
    });
    expect(viewModel.projects).toHaveLength(2);
    expect(viewModel.activeProject).toMatchObject({
      id: "project-1",
      slug: "alpha-release",
      metrics: {
        totalBlocks: 2,
        completedBlocks: 1,
        readyBlocks: 1,
        dependencyCount: 1,
        projectAssignmentsCount: 1,
        blockAssignmentCount: 1,
        projectCommentsCount: 1,
        blockCommentCount: 1
      }
    });
  });

  it("should produce a redirect selection when no project slug is requested", async () => {
    const project = createProject({
      id: "project-1",
      name: "Alpha release",
      slug: "alpha-release"
    });
    const services = createWorkspaceReadServices({
      projects: new InMemoryProjectRepository([project], { "user-1": ["project-1"] }),
      blocks: new InMemoryBlockRepository(),
      statusHistory: new InMemoryBlockStatusHistoryRepository(),
      graph: new InMemoryGraphRepository(),
      assignments: new InMemoryAssignmentRepository(),
      comments: new InMemoryCommentRepository()
    });

    const viewModel = await services.workspaceShellViewModel.execute({
      session: {
        userId: "user-1",
        email: "lead@commandmethod.local",
        displayName: "Lead User",
        roles: ["lead"]
      }
    });

    expect(viewModel.selection).toMatchObject({
      state: "redirect",
      redirectToSlug: "alpha-release",
      selectedProjectSlug: "alpha-release"
    });
  });

  it("should return an empty workspace state when the user has no accessible projects", async () => {
    const services = createWorkspaceReadServices({
      projects: new InMemoryProjectRepository(),
      blocks: new InMemoryBlockRepository(),
      statusHistory: new InMemoryBlockStatusHistoryRepository(),
      graph: new InMemoryGraphRepository(),
      assignments: new InMemoryAssignmentRepository(),
      comments: new InMemoryCommentRepository()
    });

    const viewModel = await services.workspaceShellViewModel.execute({
      session: {
        userId: "user-2",
        email: "member@commandmethod.local",
        displayName: "Member User",
        roles: ["member"]
      }
    });

    expect(viewModel.selection).toEqual({
      requestedProjectSlug: null,
      selectedProjectSlug: null,
      redirectToSlug: null,
      state: "empty"
    });
    expect(viewModel.projects).toEqual([]);
    expect(viewModel.activeProject).toBeNull();
  });
});
