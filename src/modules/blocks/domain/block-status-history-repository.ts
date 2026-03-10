import { BlockStatusHistoryEntry } from "./block-status-history-entry";

export interface BlockStatusHistoryRepository {
  append(entry: BlockStatusHistoryEntry): Promise<void>;
  listByBlockId(blockId: string): Promise<BlockStatusHistoryEntry[]>;
}
