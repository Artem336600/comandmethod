import { randomUUID } from "node:crypto";
import { BlockStatusHistoryEntry, type BlockStatus } from "@/src/modules/blocks/domain";
import type { BlockStatusTransitionUnitOfWork } from "./block-status-transition-unit-of-work";
import { DomainValidationError } from "@/src/shared/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("blocks/application/change-block-status-service");

export type ChangeBlockStatusInput = {
  blockId: string;
  nextStatus: BlockStatus;
  changedByUserId: string;
  reason?: string | null;
  blocker?: {
    reason: string;
    source: string;
    unblockCondition: string;
  } | null;
  occurredAt?: Date;
  historyEntryId?: string;
};

export class ChangeBlockStatusService {
  constructor(private readonly unitOfWork: BlockStatusTransitionUnitOfWork) {}

  async execute(input: ChangeBlockStatusInput) {
    logger.debug("[ChangeBlockStatusService.execute] Changing block status", {
      blockId: input.blockId,
      nextStatus: input.nextStatus,
      changedByUserId: input.changedByUserId
    });

    return this.unitOfWork.run(async ({ blocks, statusHistory }) => {
      const block = await blocks.findById(input.blockId);

      if (!block) {
        logger.warn("[ChangeBlockStatusService.execute] Block not found for status change", {
          blockId: input.blockId
        });
        throw new DomainValidationError("Block not found.", { blockId: input.blockId });
      }

      const updatedBlock = block.reframeStatus(
        input.nextStatus,
        input.blocker ?? null,
        input.occurredAt ?? new Date()
      );

      await blocks.save(updatedBlock);

      const historyEntry = BlockStatusHistoryEntry.create({
        id: input.historyEntryId ?? randomUUID(),
        blockId: updatedBlock.id,
        fromStatus: block.status,
        toStatus: updatedBlock.status,
        changedByUserId: input.changedByUserId,
        eventType: block.status === updatedBlock.status ? "status_backfilled" : "status_changed",
        reason: input.reason ?? null,
        blocker: updatedBlock.blocker,
        occurredAt: input.occurredAt ?? new Date()
      });

      await statusHistory.append(historyEntry);

      logger.info("[ChangeBlockStatusService.execute] Block status changed", {
        blockId: updatedBlock.id,
        fromStatus: block.status,
        toStatus: updatedBlock.status
      });

      return updatedBlock;
    });
  }
}
