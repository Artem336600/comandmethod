import type { AssignmentScope, AssignmentUnitOfWork } from "@/src/modules/assignments/application";
import { prisma } from "@/src/shared/db";
import { createModuleLogger } from "@/src/shared/lib";
import { PrismaAssignmentHistoryRepository } from "./prisma-assignment-history-repository";
import { PrismaAssignmentRepository } from "./prisma-assignment-repository";

const logger = createModuleLogger("assignments/infrastructure/prisma-assignment-unit-of-work");

export class PrismaAssignmentUnitOfWork implements AssignmentUnitOfWork {
  async run<T>(operation: (scope: AssignmentScope) => Promise<T>): Promise<T> {
    logger.debug("[PrismaAssignmentUnitOfWork.run] Starting assignment transaction");

    try {
      const result = await prisma.$transaction(async (tx) =>
        operation({
          assignments: new PrismaAssignmentRepository(tx),
          assignmentHistory: new PrismaAssignmentHistoryRepository(tx)
        })
      );

      logger.info("[PrismaAssignmentUnitOfWork.run] Assignment transaction committed");
      return result;
    } catch (error) {
      logger.error("[PrismaAssignmentUnitOfWork.run] Assignment transaction failed", {
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }
}
