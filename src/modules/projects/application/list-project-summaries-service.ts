import type { ProjectRepository } from "@/src/modules/projects/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("projects/application/list-project-summaries-service");

export type ProjectSummaryReadModel = {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "active" | "archived";
  description: string | null;
  startBlockId: string | null;
  finishBlockId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class ListProjectSummariesService {
  constructor(private readonly projects: ProjectRepository) {}

  async execute(input: { userId: string }) {
    logger.debug("[ListProjectSummariesService.execute] Listing project summaries", {
      userId: input.userId
    });

    const projects = await this.projects.listByMember(input.userId);

    const result = projects.map((project) => {
      const snapshot = project.toSnapshot();

      return {
        id: snapshot.id,
        name: snapshot.name,
        slug: snapshot.slug.value,
        status: snapshot.status,
        description: snapshot.description,
        startBlockId: snapshot.startBlockId,
        finishBlockId: snapshot.finishBlockId,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt
      } satisfies ProjectSummaryReadModel;
    });

    logger.info("[ListProjectSummariesService.execute] Project summaries listed", {
      userId: input.userId,
      count: result.length
    });

    return result;
  }
}
