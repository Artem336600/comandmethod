import { getServerSession } from "@/src/shared/auth";
import { createModuleLogger } from "@/src/shared/lib";
import { createWorkspaceReadServices } from "@/src/modules/views/application";
import { PrismaProjectRepository } from "@/src/modules/projects/infrastructure";
import { PrismaBlockRepository, PrismaBlockStatusHistoryRepository } from "@/src/modules/blocks/infrastructure";
import { PrismaGraphRepository } from "@/src/modules/graph/infrastructure";
import { PrismaAssignmentRepository } from "@/src/modules/assignments/infrastructure";
import { PrismaCommentRepository } from "@/src/modules/comments/infrastructure";

const logger = createModuleLogger("views/projects/workspace-shell-data");

export async function loadWorkspaceShellViewModel(requestedProjectSlug?: string | null) {
  logger.debug("[loadWorkspaceShellViewModel] Loading workspace shell data", {
    requestedProjectSlug: requestedProjectSlug ?? null
  });

  const session = await getServerSession();

  if (!session) {
    logger.error("[loadWorkspaceShellViewModel] Session required for workspace shell");
    throw new Error("Workspace shell requires an active session.");
  }

  const services = createWorkspaceReadServices({
    projects: new PrismaProjectRepository(),
    blocks: new PrismaBlockRepository(),
    statusHistory: new PrismaBlockStatusHistoryRepository(),
    graph: new PrismaGraphRepository(),
    assignments: new PrismaAssignmentRepository(),
    comments: new PrismaCommentRepository()
  });

  return services.workspaceShellViewModel.execute({
    session,
    requestedProjectSlug
  });
}
