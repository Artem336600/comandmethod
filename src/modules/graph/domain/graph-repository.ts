import { BlockDependency } from "./block-dependency";

export interface GraphRepository {
  saveDependency(dependency: BlockDependency): Promise<void>;
  removeDependency(projectId: string, predecessorBlockId: string, successorBlockId: string): Promise<void>;
  listDependenciesByProjectId(projectId: string): Promise<BlockDependency[]>;
  findPath(projectId: string, fromBlockId: string, toBlockId: string): Promise<string[]>;
}
