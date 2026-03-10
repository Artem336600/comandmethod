import type { BlockStatusHistoryRepository } from "@/src/modules/blocks/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("blocks/application/list-block-status-history-service");

export type BlockStatusHistoryReadModel = {
  id: string;
  blockId: string;
  fromStatus: "draft" | "ready" | "in_progress" | "in_review" | "done" | "blocked" | "cancelled" | null;
  toStatus: "draft" | "ready" | "in_progress" | "in_review" | "done" | "blocked" | "cancelled";
  changedByUserId: string;
  eventType: "status_changed" | "status_backfilled";
  reason: string | null;
  blocker:
    | {
        reason: string;
        source: string;
        unblockCondition: string;
      }
    | null;
  occurredAt: Date;
};

export class ListBlockStatusHistoryService {
  constructor(private readonly statusHistory: BlockStatusHistoryRepository) {}

  async execute(input: { blockId: string }) {
    logger.debug("[ListBlockStatusHistoryService.execute] Listing block status history", {
      blockId: input.blockId
    });

    const entries = await this.statusHistory.listByBlockId(input.blockId);
    const result = entries.map((entry) => ({
      id: entry.id,
      blockId: entry.blockId,
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      changedByUserId: entry.changedByUserId,
      eventType: entry.eventType,
      reason: entry.reason,
      blocker: entry.blocker
        ? {
            reason: entry.blocker.reason,
            source: entry.blocker.source,
            unblockCondition: entry.blocker.unblockCondition
          }
        : null,
      occurredAt: entry.occurredAt
    } satisfies BlockStatusHistoryReadModel));

    logger.info("[ListBlockStatusHistoryService.execute] Block status history listed", {
      blockId: input.blockId,
      count: result.length
    });

    return result;
  }
}
