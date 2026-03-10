import type { BlockRepository } from "@/src/modules/blocks/domain";
import { createModuleLogger } from "@/src/shared/lib";
import { prisma, type PrismaDbClient } from "@/src/shared/db";
import { mapBlockDomainToPersistence, mapBlockRecordToDomain } from "./prisma-block-mapper";

const logger = createModuleLogger("blocks/infrastructure/prisma-block-repository");

export class PrismaBlockRepository implements BlockRepository {
  constructor(private readonly db: PrismaDbClient = prisma) {}

  async save(block: Parameters<BlockRepository["save"]>[0]): Promise<void> {
    const payload = mapBlockDomainToPersistence(block);

    logger.debug("[PrismaBlockRepository.save] Persisting block", {
      blockId: payload.id,
      projectId: payload.projectId,
      status: payload.status,
      usesSharedClient: this.db === prisma
    });

    try {
      await this.db.block.upsert({
        where: { id: payload.id },
        create: payload,
        update: payload
      });

      logger.info("[PrismaBlockRepository.save] Block persisted", {
        blockId: payload.id,
        projectId: payload.projectId,
        status: payload.status
      });
    } catch (error) {
      logger.error("[PrismaBlockRepository.save] Failed to persist block", {
        blockId: payload.id,
        projectId: payload.projectId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async findById(blockId: string) {
    logger.debug("[PrismaBlockRepository.findById] Looking up block", {
      blockId,
      usesSharedClient: this.db === prisma
    });

    try {
      const record = await this.db.block.findUnique({
        where: { id: blockId }
      });

      if (!record) {
        logger.warn("[PrismaBlockRepository.findById] Block not found", {
          blockId
        });
        return null;
      }

      logger.info("[PrismaBlockRepository.findById] Block loaded", {
        blockId,
        projectId: record.projectId
      });
      return mapBlockRecordToDomain(record);
    } catch (error) {
      logger.error("[PrismaBlockRepository.findById] Failed to load block", {
        blockId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async listByProjectId(projectId: string) {
    logger.debug("[PrismaBlockRepository.listByProjectId] Listing blocks for project", {
      projectId,
      usesSharedClient: this.db === prisma
    });

    try {
      const records = await this.db.block.findMany({
        where: { projectId },
        orderBy: [{ createdAt: "asc" }, { title: "asc" }]
      });

      logger.info("[PrismaBlockRepository.listByProjectId] Blocks listed", {
        projectId,
        count: records.length
      });

      return records.map(mapBlockRecordToDomain);
    } catch (error) {
      logger.error("[PrismaBlockRepository.listByProjectId] Failed to list blocks", {
        projectId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async listChildren(parentBlockId: string) {
    logger.debug("[PrismaBlockRepository.listChildren] Listing child blocks", {
      parentBlockId,
      usesSharedClient: this.db === prisma
    });

    try {
      const records = await this.db.block.findMany({
        where: { parentBlockId },
        orderBy: [{ createdAt: "asc" }, { title: "asc" }]
      });

      logger.info("[PrismaBlockRepository.listChildren] Child blocks listed", {
        parentBlockId,
        count: records.length
      });

      return records.map(mapBlockRecordToDomain);
    } catch (error) {
      logger.error("[PrismaBlockRepository.listChildren] Failed to list child blocks", {
        parentBlockId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }
}
