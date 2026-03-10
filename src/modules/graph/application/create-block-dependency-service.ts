import { randomUUID } from "node:crypto";
import { BlockDependency, BlockDependencyPolicy, type GraphRepository } from "@/src/modules/graph/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("graph/application/create-block-dependency-service");

export type CreateBlockDependencyInput = {
  dependencyId?: string;
  projectId: string;
  predecessorBlockId: string;
  successorBlockId: string;
  createdAt?: Date;
};

export class CreateBlockDependencyService {
  constructor(private readonly graph: GraphRepository) {}

  async execute(input: CreateBlockDependencyInput) {
    logger.debug("[CreateBlockDependencyService.execute] Validating dependency creation request", {
      projectId: input.projectId,
      predecessorBlockId: input.predecessorBlockId,
      successorBlockId: input.successorBlockId
    });

    BlockDependencyPolicy.assertNoSelfDependency(input.predecessorBlockId, input.successorBlockId);

    const existingDependencies = await this.graph.listDependenciesByProjectId(input.projectId);
    BlockDependencyPolicy.assertNoDuplicateDependency(existingDependencies, input);

    const path = await this.graph.findPath(
      input.projectId,
      input.successorBlockId,
      input.predecessorBlockId
    );

    BlockDependencyPolicy.assertNoCycleDetected(path);

    const dependency = BlockDependency.create({
      id: input.dependencyId ?? randomUUID(),
      projectId: input.projectId,
      predecessorBlockId: input.predecessorBlockId,
      successorBlockId: input.successorBlockId,
      createdAt: input.createdAt
    });

    await this.graph.saveDependency(dependency);

    logger.info("[CreateBlockDependencyService.execute] Dependency created", {
      dependencyId: dependency.id,
      projectId: dependency.projectId,
      predecessorBlockId: dependency.predecessorBlockId,
      successorBlockId: dependency.successorBlockId
    });

    return dependency;
  }
}
