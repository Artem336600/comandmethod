export const BLOCK_KINDS = ["deliverable", "milestone", "decision", "review", "release"] as const;

export type BlockKind = (typeof BLOCK_KINDS)[number];
