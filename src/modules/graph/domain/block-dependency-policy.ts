import { DomainValidationError } from "@/src/shared/domain";
import { BlockDependency } from "./block-dependency";

export class BlockDependencyPolicy {
  static assertNoSelfDependency(predecessorBlockId: string, successorBlockId: string): void {
    if (predecessorBlockId === successorBlockId) {
      throw new DomainValidationError("A block cannot depend on itself.", {
        predecessorBlockId,
        successorBlockId
      });
    }
  }

  static assertNoDuplicateDependency(
    dependencies: readonly BlockDependency[],
    candidate: Pick<BlockDependency, "predecessorBlockId" | "successorBlockId">
  ): void {
    const duplicate = dependencies.find(
      (dependency) =>
        dependency.predecessorBlockId === candidate.predecessorBlockId &&
        dependency.successorBlockId === candidate.successorBlockId
    );

    if (duplicate) {
      throw new DomainValidationError("Duplicate dependencies are not allowed.", {
        predecessorBlockId: candidate.predecessorBlockId,
        successorBlockId: candidate.successorBlockId
      });
    }
  }

  static assertNoCycleDetected(pathBlockIds: readonly string[]): void {
    if (pathBlockIds.length > 0) {
      throw new DomainValidationError("A dependency cycle was detected.", {
        pathBlockIds
      });
    }
  }
}
