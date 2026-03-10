import { Block } from "./block";

export interface BlockRepository {
  save(block: Block): Promise<void>;
  findById(blockId: string): Promise<Block | null>;
  listByProjectId(projectId: string): Promise<Block[]>;
  listChildren(parentBlockId: string): Promise<Block[]>;
}
