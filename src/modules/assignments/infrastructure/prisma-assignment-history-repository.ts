import type { AssignmentHistoryRepository } from "@/src/modules/assignments/domain";
import { AssignmentHistoryEntry, AssignmentTarget } from "@/src/modules/assignments/domain";
import { prisma, type PrismaDbClient } from "@/src/shared/db";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("assignments/infrastructure/prisma-assignment-history-repository");

const ASSIGNMENT_ROLE_TO_PERSISTENCE = {
  admin: "ADMIN",
  pm: "PM",
  lead: "LEAD",
  member: "MEMBER",
  viewer: "VIEWER",
  owner: "OWNER",
  assignee: "ASSIGNEE",
  reviewer: "REVIEWER",
  watcher: "WATCHER"
} as const;

const ASSIGNMENT_ROLE_TO_DOMAIN = {
  ADMIN: "admin",
  PM: "pm",
  LEAD: "lead",
  MEMBER: "member",
  VIEWER: "viewer",
  OWNER: "owner",
  ASSIGNEE: "assignee",
  REVIEWER: "reviewer",
  WATCHER: "watcher"
} as const;

export class PrismaAssignmentHistoryRepository implements AssignmentHistoryRepository {
  constructor(private readonly db: PrismaDbClient = prisma) {}

  async append(entry: AssignmentHistoryEntry): Promise<void> {
    logger.debug("[PrismaAssignmentHistoryRepository.append] Appending assignment history", {
      historyEntryId: entry.id,
      assignmentId: entry.assignmentId,
      targetType: entry.target.type,
      targetId: entry.target.targetId,
      usesSharedClient: this.db === prisma
    });

    try {
      await this.db.assignmentHistory.create({
        data: {
          id: entry.id,
          assignmentId: entry.assignmentId,
          projectId: entry.target.projectId,
          blockId: entry.target.type === "block" ? entry.target.targetId : null,
          targetType: entry.target.type === "block" ? "BLOCK" : "PROJECT",
          role: ASSIGNMENT_ROLE_TO_PERSISTENCE[entry.role],
          subjectUserId: entry.subjectUserId,
          changedByUserId: entry.changedByUserId,
          eventType: entry.eventType === "assigned" ? "ASSIGNED" : "REVOKED",
          occurredAt: entry.occurredAt
        }
      });

      logger.info("[PrismaAssignmentHistoryRepository.append] Assignment history appended", {
        historyEntryId: entry.id,
        assignmentId: entry.assignmentId
      });
    } catch (error) {
      logger.error("[PrismaAssignmentHistoryRepository.append] Failed to append assignment history", {
        historyEntryId: entry.id,
        assignmentId: entry.assignmentId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async listByTarget(target: AssignmentTarget) {
    logger.debug("[PrismaAssignmentHistoryRepository.listByTarget] Listing assignment history", {
      targetType: target.type,
      targetId: target.targetId,
      usesSharedClient: this.db === prisma
    });

    try {
      const records = await this.db.assignmentHistory.findMany({
        where:
          target.type === "block"
            ? {
                projectId: target.projectId,
                blockId: target.targetId,
                targetType: "BLOCK"
              }
            : {
                projectId: target.projectId,
                blockId: null,
                targetType: "PROJECT"
              },
        orderBy: [{ occurredAt: "asc" }, { id: "asc" }]
      });

      logger.info("[PrismaAssignmentHistoryRepository.listByTarget] Assignment history listed", {
        targetType: target.type,
        targetId: target.targetId,
        count: records.length
      });

      return records.map((record) =>
        AssignmentHistoryEntry.create({
          id: record.id,
          assignmentId: record.assignmentId,
          target:
            record.targetType === "BLOCK" && record.blockId
              ? AssignmentTarget.forBlock(record.projectId, record.blockId)
              : AssignmentTarget.forProject(record.projectId),
          role: ASSIGNMENT_ROLE_TO_DOMAIN[record.role],
          subjectUserId: record.subjectUserId,
          changedByUserId: record.changedByUserId,
          eventType: record.eventType === "ASSIGNED" ? "assigned" : "revoked",
          occurredAt: record.occurredAt
        })
      );
    } catch (error) {
      logger.error("[PrismaAssignmentHistoryRepository.listByTarget] Failed to list assignment history", {
        targetType: target.type,
        targetId: target.targetId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }
}
