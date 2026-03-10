import { Project } from "./project";
import { ProjectSlug } from "./project-slug";

export interface ProjectRepository {
  save(project: Project): Promise<void>;
  findById(projectId: string): Promise<Project | null>;
  findBySlug(slug: ProjectSlug): Promise<Project | null>;
  listByMember(userId: string): Promise<Project[]>;
}
