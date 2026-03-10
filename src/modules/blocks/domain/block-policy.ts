import { DomainValidationError, assertOptionalText } from "@/src/shared/domain";
import { BlockerDetails } from "./blocker-details";
import { DefinitionOfDone } from "./definition-of-done";
import type { BlockStatus } from "./block-status";

type BlockLifecycleInput = {
  blockId: string;
  parentBlockId: string | null;
  status: BlockStatus;
  ownerId: string | null;
  expectedResult: string | null;
  definitionOfDone: DefinitionOfDone | null;
  blocker: BlockerDetails | null;
};

const NON_DRAFT_STATUSES = new Set<BlockStatus>([
  "ready",
  "in_progress",
  "in_review",
  "done",
  "blocked",
  "cancelled"
]);

export class BlockPolicy {
  static assertLifecycleState(input: BlockLifecycleInput): void {
    if (input.parentBlockId && input.parentBlockId === input.blockId) {
      throw new DomainValidationError("A block cannot be its own parent.", {
        blockId: input.blockId
      });
    }

    if (NON_DRAFT_STATUSES.has(input.status)) {
      if (!assertOptionalText(input.ownerId, "ownerId")) {
        throw new DomainValidationError("A block must have an owner before leaving draft.", {
          blockId: input.blockId,
          status: input.status
        });
      }

      if (!assertOptionalText(input.expectedResult, "expectedResult")) {
        throw new DomainValidationError("A block must define an expected result before leaving draft.", {
          blockId: input.blockId,
          status: input.status
        });
      }

      if (!input.definitionOfDone) {
        throw new DomainValidationError("A block must define a definition of done before leaving draft.", {
          blockId: input.blockId,
          status: input.status
        });
      }
    }

    if (input.status === "blocked" && !input.blocker) {
      throw new DomainValidationError("Blocked blocks require blocker details.", {
        blockId: input.blockId
      });
    }

    if (input.status !== "blocked" && input.blocker) {
      throw new DomainValidationError("Only blocked blocks can store blocker details.", {
        blockId: input.blockId,
        status: input.status
      });
    }
  }
}
