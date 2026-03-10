export const BLOCK_STATUSES = [
  "draft",
  "ready",
  "in_progress",
  "in_review",
  "done",
  "blocked",
  "cancelled"
] as const;

export type BlockStatus = (typeof BLOCK_STATUSES)[number];
