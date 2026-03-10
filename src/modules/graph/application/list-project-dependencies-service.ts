import type { GraphRepository } from "@/src/modules/graph/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("graph/application/list-project-dependencies-service");

export type DependencyReadModel = {
  id: string;
  projectId: string;
  predecessorBlockId: string;
  successorBlockId: string;
  createdAt: Date;
};

export class ListProjectDependenciesService {
  constructor(private readonly graph: GraphRepository) {}

  async execute(input: { projectId: string }) {
    logger.debug("[ListProjectDependenciesService.execute] Listing project dependencies", {
      projectId: input.projectId
    });

    const dependencies = await this.graph.listDependenciesByProjectId(input.projectId);
    const result = dependencies.map((dependency) => ({
      id: dependency.id,
      projectId: dependency.projectId,
      predecessorBlockId: dependency.predecessorBlockId,
      successorBlockId: dependency.successorBlockId,
      createdAt: dependency.createdAt
    } satisfies DependencyReadModel));

    logger.info("[ListProjectDependenciesService.execute] Project dependencies listed", {
      projectId: input.projectId,
      count: result.length
    });

    return result;
  }
}
