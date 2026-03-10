import type { ProjectRepository } from "@/src/modules/projects/domain";
import { ProjectSlug } from "@/src/modules/projects/domain";
import { createModuleLogger } from "@/src/shared/lib";
import { prisma, type PrismaDbClient } from "@/src/shared/db";
import { mapProjectDomainToPersistence, mapProjectRecordToDomain } from "./prisma-project-mapper";

const logger = createModuleLogger("projects/infrastructure/prisma-project-repository");

export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly db: PrismaDbClient = prisma) {}

  async save(project: Parameters<ProjectRepository["save"]>[0]): Promise<void> {
    const payload = mapProjectDomainToPersistence(project);

    logger.debug("[PrismaProjectRepository.save] Persisting project", {
      projectId: payload.id,
      status: payload.status,
      usesSharedClient: this.db === prisma
    });

    try {
      await this.db.project.upsert({
        where: { id: payload.id },
        create: payload,
        update: payload
      });

      logger.info("[PrismaProjectRepository.save] Project persisted", {
        projectId: payload.id,
        status: payload.status
      });
    } catch (error) {
      logger.error("[PrismaProjectRepository.save] Failed to persist project", {
        projectId: payload.id,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async findById(projectId: string) {
    logger.debug("[PrismaProjectRepository.findById] Looking up project", {
      projectId,
      usesSharedClient: this.db === prisma
    });

    try {
      const record = await this.db.project.findUnique({
        where: { id: projectId }
      });

      if (!record) {
        logger.warn("[PrismaProjectRepository.findById] Project not found", {
          projectId
        });
        return null;
      }

      logger.info("[PrismaProjectRepository.findById] Project loaded", {
        projectId
      });
      return mapProjectRecordToDomain(record);
    } catch (error) {
      logger.error("[PrismaProjectRepository.findById] Failed to load project", {
        projectId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async findBySlug(slug: ProjectSlug) {
    logger.debug("[PrismaProjectRepository.findBySlug] Looking up project by slug", {
      slug: slug.value,
      usesSharedClient: this.db === prisma
    });

    try {
      const record = await this.db.project.findUnique({
        where: { slug: slug.value }
      });

      if (!record) {
        logger.warn("[PrismaProjectRepository.findBySlug] Project not found", {
          slug: slug.value
        });
        return null;
      }

      logger.info("[PrismaProjectRepository.findBySlug] Project loaded", {
        projectId: record.id,
        slug: slug.value
      });
      return mapProjectRecordToDomain(record);
    } catch (error) {
      logger.error("[PrismaProjectRepository.findBySlug] Failed to load project", {
        slug: slug.value,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async listByMember(userId: string) {
    logger.debug("[PrismaProjectRepository.listByMember] Listing projects for member", {
      userId,
      usesSharedClient: this.db === prisma
    });

    try {
      const records = await this.db.project.findMany({
        where: {
          assignments: {
            some: {
              targetType: "PROJECT",
              subjectUserId: userId,
              revokedAt: null
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      logger.info("[PrismaProjectRepository.listByMember] Projects listed", {
        userId,
        count: records.length
      });

      return records.map(mapProjectRecordToDomain);
    } catch (error) {
      logger.error("[PrismaProjectRepository.listByMember] Failed to list projects", {
        userId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }
}
