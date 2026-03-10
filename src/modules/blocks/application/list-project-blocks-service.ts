import type { BlockRepository } from "@/src/modules/blocks/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("blocks/application/list-project-blocks-service");

export type BlockReadModel = {
  id: string;
  projectId: string;
  parentBlockId: string | null;
  title: string;
  summary: string | null;
  expectedResult: string | null;
  definitionOfDone: string[];
  acceptanceCriteria: string[];
  ownerId: string | null;
  status: "draft" | "ready" | "in_progress" | "in_review" | "done" | "blocked" | "cancelled";
  blocker:
    | {
        reason: string;
        source: string;
        unblockCondition: string;
      }
    | null;
  kind: "deliverable" | "milestone" | "decision" | "review" | "release";
  createdAt: Date;
  updatedAt: Date;
};

export class ListProjectBlocksService {
  constructor(private readonly blocks: BlockRepository) {}

  async execute(input: { projectId: string }) {
    logger.debug("[ListProjectBlocksService.execute] Listing project blocks", {
      projectId: input.projectId
    });

    const blocks = await this.blocks.listByProjectId(input.projectId);
    const result = blocks.map((block) => {
      const snapshot = block.toSnapshot();

      return {
        id: snapshot.id,
        projectId: snapshot.projectId,
        parentBlockId: snapshot.parentBlockId,
        title: snapshot.title,
        summary: snapshot.summary,
        expectedResult: snapshot.expectedResult,
        definitionOfDone: snapshot.definitionOfDone?.items ?? [],
        acceptanceCriteria: snapshot.acceptanceCriteria,
        ownerId: snapshot.ownerId,
        status: snapshot.status,
        blocker: snapshot.blocker
          ? {
              reason: snapshot.blocker.reason,
              source: snapshot.blocker.source,
              unblockCondition: snapshot.blocker.unblockCondition
            }
          : null,
        kind: snapshot.kind,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt
      } satisfies BlockReadModel;
    });

    logger.info("[ListProjectBlocksService.execute] Project blocks listed", {
      projectId: input.projectId,
      count: result.length
    });

    return result;
  }
}
