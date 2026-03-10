import type { BlockStatusHistoryRepository } from "@/src/modules/blocks/domain";
import { BlockStatusHistoryEntry } from "@/src/modules/blocks/domain";
import { prisma, type PrismaDbClient } from "@/src/shared/db";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("blocks/infrastructure/prisma-block-status-history-repository");

const BLOCK_STATUS_TO_PERSISTENCE: Record<
  "draft" | "ready" | "in_progress" | "in_review" | "done" | "blocked" | "cancelled",
  "DRAFT" | "READY" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "BLOCKED" | "CANCELLED"
> = {
  draft: "DRAFT",
  ready: "READY",
  in_progress: "IN_PROGRESS",
  in_review: "IN_REVIEW",
  done: "DONE",
  blocked: "BLOCKED",
  cancelled: "CANCELLED"
};

const BLOCK_STATUS_TO_DOMAIN: Record<
  "DRAFT" | "READY" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "BLOCKED" | "CANCELLED",
  "draft" | "ready" | "in_progress" | "in_review" | "done" | "blocked" | "cancelled"
> = {
  DRAFT: "draft",
  READY: "ready",
  IN_PROGRESS: "in_progress",
  IN_REVIEW: "in_review",
  DONE: "done",
  BLOCKED: "blocked",
  CANCELLED: "cancelled"
};

export class PrismaBlockStatusHistoryRepository implements BlockStatusHistoryRepository {
  constructor(private readonly db: PrismaDbClient = prisma) {}

  async append(entry: BlockStatusHistoryEntry): Promise<void> {
    logger.debug("[PrismaBlockStatusHistoryRepository.append] Appending history entry", {
      historyEntryId: entry.id,
      blockId: entry.blockId,
      toStatus: entry.toStatus,
      usesSharedClient: this.db === prisma
    });

    try {
      await this.db.blockStatusHistory.create({
        data: {
          id: entry.id,
          blockId: entry.blockId,
          fromStatus: entry.fromStatus ? BLOCK_STATUS_TO_PERSISTENCE[entry.fromStatus] : null,
          toStatus: BLOCK_STATUS_TO_PERSISTENCE[entry.toStatus],
          changedByUserId: entry.changedByUserId,
          eventType: entry.eventType === "status_backfilled" ? "STATUS_BACKFILLED" : "STATUS_CHANGED",
          reason: entry.reason,
          blockerReason: entry.blocker?.reason ?? null,
          blockerSource: entry.blocker?.source ?? null,
          unblockCondition: entry.blocker?.unblockCondition ?? null,
          occurredAt: entry.occurredAt
        }
      });

      logger.info("[PrismaBlockStatusHistoryRepository.append] History entry appended", {
        historyEntryId: entry.id,
        blockId: entry.blockId
      });
    } catch (error) {
      logger.error("[PrismaBlockStatusHistoryRepository.append] Failed to append history entry", {
        historyEntryId: entry.id,
        blockId: entry.blockId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async listByBlockId(blockId: string) {
    logger.debug("[PrismaBlockStatusHistoryRepository.listByBlockId] Listing history entries", {
      blockId,
      usesSharedClient: this.db === prisma
    });

    try {
      const records = await this.db.blockStatusHistory.findMany({
        where: { blockId },
        orderBy: [{ occurredAt: "asc" }, { id: "asc" }]
      });

      logger.info("[PrismaBlockStatusHistoryRepository.listByBlockId] History entries listed", {
        blockId,
        count: records.length
      });

      return records.map((record) =>
        BlockStatusHistoryEntry.create({
          id: record.id,
          blockId: record.blockId,
          fromStatus: record.fromStatus ? BLOCK_STATUS_TO_DOMAIN[record.fromStatus] : null,
          toStatus: BLOCK_STATUS_TO_DOMAIN[record.toStatus],
          changedByUserId: record.changedByUserId,
          eventType: record.eventType === "STATUS_BACKFILLED" ? "status_backfilled" : "status_changed",
          reason: record.reason,
          blocker:
            record.blockerReason && record.blockerSource && record.unblockCondition
              ? {
                  reason: record.blockerReason,
                  source: record.blockerSource,
                  unblockCondition: record.unblockCondition
                }
              : null,
          occurredAt: record.occurredAt
        })
      );
    } catch (error) {
      logger.error("[PrismaBlockStatusHistoryRepository.listByBlockId] Failed to list history entries", {
        blockId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }
}
