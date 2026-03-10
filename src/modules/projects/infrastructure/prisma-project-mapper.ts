import type { Project as PrismaProjectRecord, ProjectStatus as PrismaProjectStatus } from "@prisma/client";
import { Project } from "@/src/modules/projects/domain";

const PROJECT_STATUS_TO_DOMAIN: Record<PrismaProjectStatus, "draft" | "active" | "archived"> = {
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived"
};

const PROJECT_STATUS_TO_PERSISTENCE: Record<"draft" | "active" | "archived", PrismaProjectStatus> = {
  draft: "DRAFT",
  active: "ACTIVE",
  archived: "ARCHIVED"
};

export function mapProjectRecordToDomain(record: PrismaProjectRecord) {
  return Project.create({
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    status: PROJECT_STATUS_TO_DOMAIN[record.status],
    startBlockId: record.startBlockId,
    finishBlockId: record.finishBlockId,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    archivedAt: record.archivedAt
  });
}

export function mapProjectDomainToPersistence(project: Project) {
  const snapshot = project.toSnapshot();

  return {
    id: snapshot.id,
    name: snapshot.name,
    slug: snapshot.slug.value,
    description: snapshot.description,
    status: PROJECT_STATUS_TO_PERSISTENCE[snapshot.status],
    startBlockId: snapshot.startBlockId,
    finishBlockId: snapshot.finishBlockId,
    createdAt: snapshot.createdAt,
    updatedAt: snapshot.updatedAt,
    archivedAt: snapshot.archivedAt
  };
}
