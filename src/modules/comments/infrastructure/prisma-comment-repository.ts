import type { CommentRepository } from "@/src/modules/comments/domain";
import { CommentTarget } from "@/src/modules/comments/domain";
import { prisma, type PrismaDbClient } from "@/src/shared/db";
import { createModuleLogger } from "@/src/shared/lib";
import { mapCommentDomainToPersistence, mapCommentRecordToDomain } from "./prisma-comment-mapper";

const logger = createModuleLogger("comments/infrastructure/prisma-comment-repository");

export class PrismaCommentRepository implements CommentRepository {
  constructor(private readonly db: PrismaDbClient = prisma) {}

  async save(comment: Parameters<CommentRepository["save"]>[0]): Promise<void> {
    const payload = mapCommentDomainToPersistence(comment);

    logger.debug("[PrismaCommentRepository.save] Persisting comment", {
      commentId: payload.id,
      projectId: payload.projectId,
      blockId: payload.blockId,
      usesSharedClient: this.db === prisma
    });

    try {
      await this.db.comment.upsert({
        where: { id: payload.id },
        create: payload,
        update: payload
      });

      logger.info("[PrismaCommentRepository.save] Comment persisted", {
        commentId: payload.id
      });
    } catch (error) {
      logger.error("[PrismaCommentRepository.save] Failed to persist comment", {
        commentId: payload.id,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async findById(commentId: string) {
    logger.debug("[PrismaCommentRepository.findById] Looking up comment", {
      commentId,
      usesSharedClient: this.db === prisma
    });

    try {
      const record = await this.db.comment.findUnique({
        where: { id: commentId }
      });

      if (!record) {
        logger.warn("[PrismaCommentRepository.findById] Comment not found", {
          commentId
        });
        return null;
      }

      logger.info("[PrismaCommentRepository.findById] Comment loaded", {
        commentId
      });
      return mapCommentRecordToDomain(record);
    } catch (error) {
      logger.error("[PrismaCommentRepository.findById] Failed to load comment", {
        commentId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async listByTarget(target: CommentTarget) {
    logger.debug("[PrismaCommentRepository.listByTarget] Listing comments", {
      targetType: target.type,
      targetId: target.targetId,
      usesSharedClient: this.db === prisma
    });

    try {
      const records = await this.db.comment.findMany({
        where: target.type === "block" ? { projectId: target.projectId, blockId: target.targetId } : { projectId: target.projectId, blockId: null },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }]
      });

      logger.info("[PrismaCommentRepository.listByTarget] Comments listed", {
        targetType: target.type,
        targetId: target.targetId,
        count: records.length
      });

      return records.map(mapCommentRecordToDomain);
    } catch (error) {
      logger.error("[PrismaCommentRepository.listByTarget] Failed to list comments", {
        targetType: target.type,
        targetId: target.targetId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }
}
