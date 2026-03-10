import { prisma } from "@/src/shared/db";
import { createModuleLogger } from "@/src/shared/lib";
import type { BlockStatusTransitionScope, BlockStatusTransitionUnitOfWork } from "@/src/modules/blocks/application";
import { PrismaBlockRepository } from "./prisma-block-repository";
import { PrismaBlockStatusHistoryRepository } from "./prisma-block-status-history-repository";

const logger = createModuleLogger("blocks/infrastructure/prisma-block-status-transition-unit-of-work");

export class PrismaBlockStatusTransitionUnitOfWork implements BlockStatusTransitionUnitOfWork {
  async run<T>(operation: (scope: BlockStatusTransitionScope) => Promise<T>): Promise<T> {
    logger.debug("[PrismaBlockStatusTransitionUnitOfWork.run] Starting block status transaction");

    try {
      const result = await prisma.$transaction(async (tx) =>
        operation({
          blocks: new PrismaBlockRepository(tx),
          statusHistory: new PrismaBlockStatusHistoryRepository(tx)
        })
      );

      logger.info("[PrismaBlockStatusTransitionUnitOfWork.run] Block status transaction committed");
      return result;
    } catch (error) {
      logger.error("[PrismaBlockStatusTransitionUnitOfWork.run] Block status transaction failed", {
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }
}
