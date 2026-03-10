import type { GraphRepository } from "@/src/modules/graph/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("graph/application/remove-block-dependency-service");

export type RemoveBlockDependencyInput = {
  projectId: string;
  predecessorBlockId: string;
  successorBlockId: string;
};

export class RemoveBlockDependencyService {
  constructor(private readonly graph: GraphRepository) {}

  async execute(input: RemoveBlockDependencyInput): Promise<void> {
    logger.debug("[RemoveBlockDependencyService.execute] Removing dependency", {
      projectId: input.projectId,
      predecessorBlockId: input.predecessorBlockId,
      successorBlockId: input.successorBlockId
    });

    await this.graph.removeDependency(
      input.projectId,
      input.predecessorBlockId,
      input.successorBlockId
    );

    logger.info("[RemoveBlockDependencyService.execute] Dependency removed", {
      projectId: input.projectId,
      predecessorBlockId: input.predecessorBlockId,
      successorBlockId: input.successorBlockId
    });
  }
}
