import { BlockDependency, type GraphRepository } from "@/src/modules/graph/domain";
import { prisma, type PrismaDbClient } from "@/src/shared/db";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("graph/infrastructure/prisma-graph-repository");

export class PrismaGraphRepository implements GraphRepository {
  constructor(private readonly db: PrismaDbClient = prisma) {}

  async saveDependency(dependency: BlockDependency): Promise<void> {
    logger.debug("[PrismaGraphRepository.saveDependency] Persisting dependency", {
      dependencyId: dependency.id,
      projectId: dependency.projectId,
      predecessorBlockId: dependency.predecessorBlockId,
      successorBlockId: dependency.successorBlockId,
      usesSharedClient: this.db === prisma
    });

    try {
      await this.db.dependency.upsert({
        where: { id: dependency.id },
        create: {
          id: dependency.id,
          projectId: dependency.projectId,
          predecessorBlockId: dependency.predecessorBlockId,
          successorBlockId: dependency.successorBlockId,
          kind: "FINISH_TO_START",
          createdAt: dependency.createdAt
        },
        update: {
          projectId: dependency.projectId,
          predecessorBlockId: dependency.predecessorBlockId,
          successorBlockId: dependency.successorBlockId,
          kind: "FINISH_TO_START"
        }
      });

      logger.info("[PrismaGraphRepository.saveDependency] Dependency persisted", {
        dependencyId: dependency.id,
        projectId: dependency.projectId
      });
    } catch (error) {
      logger.error("[PrismaGraphRepository.saveDependency] Failed to persist dependency", {
        dependencyId: dependency.id,
        projectId: dependency.projectId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async removeDependency(projectId: string, predecessorBlockId: string, successorBlockId: string): Promise<void> {
    logger.debug("[PrismaGraphRepository.removeDependency] Removing dependency", {
      projectId,
      predecessorBlockId,
      successorBlockId,
      usesSharedClient: this.db === prisma
    });

    try {
      const result = await this.db.dependency.deleteMany({
        where: {
          projectId,
          predecessorBlockId,
          successorBlockId
        }
      });

      if (result.count === 0) {
        logger.warn("[PrismaGraphRepository.removeDependency] Dependency not found", {
          projectId,
          predecessorBlockId,
          successorBlockId
        });
        return;
      }

      logger.info("[PrismaGraphRepository.removeDependency] Dependency removed", {
        projectId,
        predecessorBlockId,
        successorBlockId,
        removedCount: result.count
      });
    } catch (error) {
      logger.error("[PrismaGraphRepository.removeDependency] Failed to remove dependency", {
        projectId,
        predecessorBlockId,
        successorBlockId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async listDependenciesByProjectId(projectId: string) {
    logger.debug("[PrismaGraphRepository.listDependenciesByProjectId] Listing dependencies", {
      projectId,
      usesSharedClient: this.db === prisma
    });

    try {
      const records = await this.db.dependency.findMany({
        where: { projectId },
        orderBy: [{ createdAt: "asc" }, { predecessorBlockId: "asc" }, { successorBlockId: "asc" }]
      });

      logger.info("[PrismaGraphRepository.listDependenciesByProjectId] Dependencies listed", {
        projectId,
        count: records.length
      });

      return records.map((record) =>
        BlockDependency.create({
          id: record.id,
          projectId: record.projectId,
          predecessorBlockId: record.predecessorBlockId,
          successorBlockId: record.successorBlockId,
          createdAt: record.createdAt
        })
      );
    } catch (error) {
      logger.error("[PrismaGraphRepository.listDependenciesByProjectId] Failed to list dependencies", {
        projectId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async findPath(projectId: string, fromBlockId: string, toBlockId: string) {
    logger.debug("[PrismaGraphRepository.findPath] Searching dependency path", {
      projectId,
      fromBlockId,
      toBlockId,
      usesSharedClient: this.db === prisma
    });

    try {
      const records = await this.db.dependency.findMany({
        where: { projectId },
        select: {
          predecessorBlockId: true,
          successorBlockId: true
        }
      });

      const adjacency = new Map<string, string[]>();

      for (const record of records) {
        const targets = adjacency.get(record.predecessorBlockId) ?? [];
        targets.push(record.successorBlockId);
        adjacency.set(record.predecessorBlockId, targets);
      }

      const queue: Array<{ blockId: string; path: string[] }> = [{ blockId: fromBlockId, path: [fromBlockId] }];
      const visited = new Set<string>([fromBlockId]);

      while (queue.length > 0) {
        const current = queue.shift();

        if (!current) {
          break;
        }

        if (current.blockId === toBlockId) {
          logger.info("[PrismaGraphRepository.findPath] Dependency path found", {
            projectId,
            fromBlockId,
            toBlockId,
            pathLength: current.path.length
          });
          return current.path;
        }

        for (const nextBlockId of adjacency.get(current.blockId) ?? []) {
          if (visited.has(nextBlockId)) {
            continue;
          }

          visited.add(nextBlockId);
          queue.push({
            blockId: nextBlockId,
            path: [...current.path, nextBlockId]
          });
        }
      }

      logger.info("[PrismaGraphRepository.findPath] No dependency path found", {
        projectId,
        fromBlockId,
        toBlockId
      });
      return [];
    } catch (error) {
      logger.error("[PrismaGraphRepository.findPath] Failed to search dependency path", {
        projectId,
        fromBlockId,
        toBlockId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }
}
