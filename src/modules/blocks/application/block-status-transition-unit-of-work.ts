import type { BlockRepository, BlockStatusHistoryRepository } from "@/src/modules/blocks/domain";

export type BlockStatusTransitionScope = {
  blocks: BlockRepository;
  statusHistory: BlockStatusHistoryRepository;
};

export interface BlockStatusTransitionUnitOfWork {
  run<T>(operation: (scope: BlockStatusTransitionScope) => Promise<T>): Promise<T>;
}
