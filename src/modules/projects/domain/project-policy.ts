import { DomainValidationError } from "@/src/shared/domain";

export class ProjectPolicy {
  static assertDistinctAnchorBlocks(startBlockId: string | null, finishBlockId: string | null): void {
    if (startBlockId && finishBlockId && startBlockId === finishBlockId) {
      throw new DomainValidationError("Project start and finish anchors must reference different blocks.", {
        startBlockId,
        finishBlockId
      });
    }
  }
}
