import type { AssignmentRepository } from "@/src/modules/assignments/domain";
import { AssignmentTarget } from "@/src/modules/assignments/domain";
import { prisma, type PrismaDbClient } from "@/src/shared/db";
import { createModuleLogger } from "@/src/shared/lib";
import { mapAssignmentDomainToPersistence, mapAssignmentRecordToDomain } from "./prisma-assignment-mapper";

const logger = createModuleLogger("assignments/infrastructure/prisma-assignment-repository");

export class PrismaAssignmentRepository implements AssignmentRepository {
  constructor(private readonly db: PrismaDbClient = prisma) {}

  async save(assignment: Parameters<AssignmentRepository["save"]>[0]): Promise<void> {
    const payload = mapAssignmentDomainToPersistence(assignment);

    logger.debug("[PrismaAssignmentRepository.save] Persisting assignment", {
      assignmentId: payload.id,
      projectId: payload.projectId,
      blockId: payload.blockId,
      role: payload.role,
      usesSharedClient: this.db === prisma
    });

    try {
      await this.db.assignment.upsert({
        where: { id: payload.id },
        create: payload,
        update: payload
      });

      logger.info("[PrismaAssignmentRepository.save] Assignment persisted", {
        assignmentId: payload.id,
        role: payload.role
      });
    } catch (error) {
      logger.error("[PrismaAssignmentRepository.save] Failed to persist assignment", {
        assignmentId: payload.id,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async findById(assignmentId: string) {
    logger.debug("[PrismaAssignmentRepository.findById] Looking up assignment", {
      assignmentId,
      usesSharedClient: this.db === prisma
    });

    try {
      const record = await this.db.assignment.findUnique({
        where: { id: assignmentId }
      });

      if (!record) {
        logger.warn("[PrismaAssignmentRepository.findById] Assignment not found", {
          assignmentId
        });
        return null;
      }

      logger.info("[PrismaAssignmentRepository.findById] Assignment loaded", {
        assignmentId
      });
      return mapAssignmentRecordToDomain(record);
    } catch (error) {
      logger.error("[PrismaAssignmentRepository.findById] Failed to load assignment", {
        assignmentId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async listByTarget(target: AssignmentTarget) {
    logger.debug("[PrismaAssignmentRepository.listByTarget] Listing assignments", {
      targetType: target.type,
      targetId: target.targetId,
      projectId: target.projectId,
      usesSharedClient: this.db === prisma
    });

    try {
      const records = await this.db.assignment.findMany({
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
        orderBy: [{ createdAt: "asc" }, { id: "asc" }]
      });

      logger.info("[PrismaAssignmentRepository.listByTarget] Assignments listed", {
        targetType: target.type,
        targetId: target.targetId,
        count: records.length
      });

      return records.map(mapAssignmentRecordToDomain);
    } catch (error) {
      logger.error("[PrismaAssignmentRepository.listByTarget] Failed to list assignments", {
        targetType: target.type,
        targetId: target.targetId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }
}
