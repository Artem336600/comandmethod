import { DomainValidationError, assertOptionalText } from "@/src/shared/domain";
import { BlockerDetails } from "./blocker-details";
import { DefinitionOfDone } from "./definition-of-done";
import type { BlockStatus } from "./block-status";

type BlockLifecycleInput = {
  blockId: string;
  parentBlockId: string | null;
  title: string;
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

const ACTIVITY_TITLE_PREFIXES = [
  "add ",
  "build ",
  "create ",
  "design ",
  "fix ",
  "implement ",
  "investigate ",
  "refactor ",
  "review ",
  "set up ",
  "setup ",
  "ship ",
  "test ",
  "update ",
  "write ",
  "добавить ",
  "исправить ",
  "написать ",
  "настроить ",
  "обновить ",
  "проверить ",
  "реализовать ",
  "сделать "
] as const;

export class BlockPolicy {
  static assertLifecycleState(input: BlockLifecycleInput): void {
    BlockPolicy.assertTitleDescribesCompletedResult(input.title);

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

  static assertTitleDescribesCompletedResult(title: string): void {
    const normalizedTitle = title.trim().toLowerCase();
    const matchingPrefix = ACTIVITY_TITLE_PREFIXES.find((prefix) => normalizedTitle.startsWith(prefix));

    if (matchingPrefix) {
      throw new DomainValidationError("Block titles must describe a completed result, not an activity.", {
        title,
        matchingPrefix
      });
    }
  }
}
