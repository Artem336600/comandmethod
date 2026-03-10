import {
  ListProjectSummariesService,
  type ProjectSummaryReadModel
} from "@/src/modules/projects/application";
import {
  ListProjectBlocksService,
  ListBlockStatusHistoryService,
  type BlockReadModel,
  type BlockStatusHistoryReadModel
} from "@/src/modules/blocks/application";
import {
  ListProjectDependenciesService,
  type DependencyReadModel
} from "@/src/modules/graph/application";
import {
  ListTargetAssignmentsService,
  type AssignmentReadModel
} from "@/src/modules/assignments/application";
import {
  ListTargetCommentsService,
  type CommentReadModel
} from "@/src/modules/comments/application";
import type { ProjectRepository } from "@/src/modules/projects/domain";
import type { BlockRepository, BlockStatusHistoryRepository } from "@/src/modules/blocks/domain";
import type { GraphRepository } from "@/src/modules/graph/domain";
import type { AssignmentRepository } from "@/src/modules/assignments/domain";
import type { CommentRepository } from "@/src/modules/comments/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("views/application/workspace-read-services");

export type WorkspaceReadDependencies = {
  projects: ProjectRepository;
  blocks: BlockRepository;
  statusHistory: BlockStatusHistoryRepository;
  graph: GraphRepository;
  assignments: AssignmentRepository;
  comments: CommentRepository;
};

export type WorkspaceProjectSnapshot = {
  projectId: string;
  blocks: BlockReadModel[];
  dependencies: DependencyReadModel[];
  projectAssignments: AssignmentReadModel[];
  blockAssignments: Record<string, AssignmentReadModel[]>;
  projectComments: CommentReadModel[];
  blockComments: Record<string, CommentReadModel[]>;
  statusHistoryByBlock: Record<string, BlockStatusHistoryReadModel[]>;
};

export class WorkspaceProjectSnapshotService {
  constructor(
    private readonly blocks: ListProjectBlocksService,
    private readonly dependencies: ListProjectDependenciesService,
    private readonly assignments: ListTargetAssignmentsService,
    private readonly comments: ListTargetCommentsService,
    private readonly statusHistory: ListBlockStatusHistoryService
  ) {}

  async execute(input: { projectId: string }) {
    logger.debug("[WorkspaceProjectSnapshotService.execute] Building project snapshot", {
      projectId: input.projectId
    });

    const blocks = await this.blocks.execute({ projectId: input.projectId });
    const dependencies = await this.dependencies.execute({ projectId: input.projectId });
    const projectAssignments = await this.assignments.execute({ projectId: input.projectId });
    const projectComments = await this.comments.execute({ projectId: input.projectId });

    const blockAssignmentsEntries = await Promise.all(
      blocks.map(async (block) => [
        block.id,
        await this.assignments.execute({ projectId: input.projectId, blockId: block.id })
      ] as const)
    );

    const blockCommentsEntries = await Promise.all(
      blocks.map(async (block) => [
        block.id,
        await this.comments.execute({ projectId: input.projectId, blockId: block.id })
      ] as const)
    );

    const statusHistoryEntries = await Promise.all(
      blocks.map(async (block) => [
        block.id,
        await this.statusHistory.execute({ blockId: block.id })
      ] as const)
    );

    const snapshot = {
      projectId: input.projectId,
      blocks,
      dependencies,
      projectAssignments,
      blockAssignments: Object.fromEntries(blockAssignmentsEntries),
      projectComments,
      blockComments: Object.fromEntries(blockCommentsEntries),
      statusHistoryByBlock: Object.fromEntries(statusHistoryEntries)
    } satisfies WorkspaceProjectSnapshot;

    logger.info("[WorkspaceProjectSnapshotService.execute] Project snapshot built", {
      projectId: input.projectId,
      blockCount: blocks.length,
      dependencyCount: dependencies.length
    });

    return snapshot;
  }
}

export function createWorkspaceReadServices(dependencies: WorkspaceReadDependencies) {
  logger.debug("[createWorkspaceReadServices] Creating workspace read services");

  const listProjectSummaries = new ListProjectSummariesService(dependencies.projects);
  const listProjectBlocks = new ListProjectBlocksService(dependencies.blocks);
  const listBlockStatusHistory = new ListBlockStatusHistoryService(dependencies.statusHistory);
  const listProjectDependencies = new ListProjectDependenciesService(dependencies.graph);
  const listTargetAssignments = new ListTargetAssignmentsService(dependencies.assignments);
  const listTargetComments = new ListTargetCommentsService(dependencies.comments);
  const workspaceProjectSnapshot = new WorkspaceProjectSnapshotService(
    listProjectBlocks,
    listProjectDependencies,
    listTargetAssignments,
    listTargetComments,
    listBlockStatusHistory
  );

  return {
    listProjectSummaries,
    listProjectBlocks,
    listBlockStatusHistory,
    listProjectDependencies,
    listTargetAssignments,
    listTargetComments,
    workspaceProjectSnapshot
  };
}

export type WorkspaceReadServices = ReturnType<typeof createWorkspaceReadServices>;
