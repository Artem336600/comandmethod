import type { AppSession } from "@/src/shared/auth";
import {
  buildWorkspaceAccessViewModel,
  resolveWorkspaceProjectSelection,
  type ListProjectSummariesService,
  type ProjectSummaryReadModel,
  type WorkspaceAccessViewModel
} from "@/src/modules/projects/application";
import { createModuleLogger } from "@/src/shared/lib";
import type { WorkspaceProjectSnapshot, WorkspaceProjectSnapshotService } from "./workspace-read-services";

const logger = createModuleLogger("views/application/workspace-shell-view-model-service");

export type WorkspaceProjectNavigationItem = ProjectSummaryReadModel & {
  href: string;
  isActive: boolean;
};

export type WorkspaceProjectMetrics = {
  totalBlocks: number;
  completedBlocks: number;
  blockedBlocks: number;
  inFlightBlocks: number;
  readyBlocks: number;
  dependencyCount: number;
  projectAssignmentsCount: number;
  projectCommentsCount: number;
  blockCommentCount: number;
  blockAssignmentCount: number;
};

export type WorkspaceActiveProjectViewModel = ProjectSummaryReadModel & {
  href: string;
  metrics: WorkspaceProjectMetrics;
  snapshot: WorkspaceProjectSnapshot;
};

export type WorkspaceShellViewModel = {
  viewer: WorkspaceAccessViewModel & {
    userId: string;
  };
  projects: WorkspaceProjectNavigationItem[];
  selection: {
    requestedProjectSlug: string | null;
    selectedProjectSlug: string | null;
    redirectToSlug: string | null;
    state: "empty" | "resolved" | "redirect";
  };
  activeProject: WorkspaceActiveProjectViewModel | null;
};

export class BuildWorkspaceShellViewModelService {
  constructor(
    private readonly listProjectSummaries: ListProjectSummariesService,
    private readonly workspaceProjectSnapshot: WorkspaceProjectSnapshotService
  ) {}

  async execute(input: { session: AppSession; requestedProjectSlug?: string | null }) {
    logger.debug("[BuildWorkspaceShellViewModelService.execute] Building workspace shell view model", {
      userId: input.session.userId,
      requestedProjectSlug: input.requestedProjectSlug ?? null
    });

    const viewer = {
      userId: input.session.userId,
      ...buildWorkspaceAccessViewModel(input.session)
    };

    const projects = await this.listProjectSummaries.execute({
      userId: input.session.userId
    });
    const selection = resolveWorkspaceProjectSelection({
      projects,
      requestedProjectSlug: input.requestedProjectSlug
    });

    if (selection.state === "empty") {
      logger.warn("[BuildWorkspaceShellViewModelService.execute] No accessible projects found for workspace shell", {
        userId: input.session.userId
      });

      return {
        viewer,
        projects: [],
        selection: {
          requestedProjectSlug: selection.requestedProjectSlug,
          selectedProjectSlug: null,
          redirectToSlug: null,
          state: selection.state
        },
        activeProject: null
      } satisfies WorkspaceShellViewModel;
    }

    if (selection.state === "redirect") {
      logger.warn("[BuildWorkspaceShellViewModelService.execute] Requested project slug is unavailable, redirecting to accessible project", {
        userId: input.session.userId,
        requestedProjectSlug: selection.requestedProjectSlug,
        redirectToSlug: selection.redirectToSlug
      });
    }

    const selectedProject = selection.selectedProject;

    if (!selectedProject) {
      logger.error("[BuildWorkspaceShellViewModelService.execute] Project selection resolved without an active project", {
        userId: input.session.userId,
        requestedProjectSlug: selection.requestedProjectSlug
      });
      throw new Error("Workspace project selection produced no active project.");
    }

    const snapshot = await this.workspaceProjectSnapshot.execute({
      projectId: selectedProject.id
    });

    const projectsNavigation = projects.map((project) => ({
      ...project,
      href: `/projects/${project.slug}`,
      isActive: project.id === selectedProject.id
    }));

    const activeProject = {
      ...selectedProject,
      href: `/projects/${selectedProject.slug}`,
      metrics: buildWorkspaceProjectMetrics(snapshot),
      snapshot
    } satisfies WorkspaceActiveProjectViewModel;

    logger.info("[BuildWorkspaceShellViewModelService.execute] Workspace shell view model built", {
      userId: input.session.userId,
      projectCount: projectsNavigation.length,
      selectedProjectSlug: selectedProject.slug,
      blockCount: snapshot.blocks.length,
      dependencyCount: snapshot.dependencies.length
    });

    return {
      viewer,
      projects: projectsNavigation,
      selection: {
        requestedProjectSlug: selection.requestedProjectSlug,
        selectedProjectSlug: selectedProject.slug,
        redirectToSlug: selection.redirectToSlug,
        state: selection.state
      },
      activeProject
    } satisfies WorkspaceShellViewModel;
  }
}

function buildWorkspaceProjectMetrics(snapshot: WorkspaceProjectSnapshot): WorkspaceProjectMetrics {
  const blockAssignmentsCount = Object.values(snapshot.blockAssignments).reduce(
    (total, assignments) => total + assignments.length,
    0
  );
  const blockCommentsCount = Object.values(snapshot.blockComments).reduce(
    (total, comments) => total + comments.length,
    0
  );

  return {
    totalBlocks: snapshot.blocks.length,
    completedBlocks: snapshot.blocks.filter((block) => block.status === "done").length,
    blockedBlocks: snapshot.blocks.filter((block) => block.status === "blocked").length,
    inFlightBlocks: snapshot.blocks.filter((block) =>
      ["in_progress", "in_review"].includes(block.status)
    ).length,
    readyBlocks: snapshot.blocks.filter((block) => block.status === "ready").length,
    dependencyCount: snapshot.dependencies.length,
    projectAssignmentsCount: snapshot.projectAssignments.length,
    projectCommentsCount: snapshot.projectComments.length,
    blockCommentCount: blockCommentsCount,
    blockAssignmentCount: blockAssignmentsCount
  };
}
