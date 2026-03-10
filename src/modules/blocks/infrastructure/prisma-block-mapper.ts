import type {
  Block as PrismaBlockRecord,
  BlockKind as PrismaBlockKind,
  BlockStatus as PrismaBlockStatus
} from "@prisma/client";
import { Block } from "@/src/modules/blocks/domain";

const BLOCK_STATUS_TO_DOMAIN: Record<
  PrismaBlockStatus,
  "draft" | "ready" | "in_progress" | "in_review" | "done" | "blocked" | "cancelled"
> = {
  DRAFT: "draft",
  READY: "ready",
  IN_PROGRESS: "in_progress",
  IN_REVIEW: "in_review",
  DONE: "done",
  BLOCKED: "blocked",
  CANCELLED: "cancelled"
};

const BLOCK_STATUS_TO_PERSISTENCE: Record<
  "draft" | "ready" | "in_progress" | "in_review" | "done" | "blocked" | "cancelled",
  PrismaBlockStatus
> = {
  draft: "DRAFT",
  ready: "READY",
  in_progress: "IN_PROGRESS",
  in_review: "IN_REVIEW",
  done: "DONE",
  blocked: "BLOCKED",
  cancelled: "CANCELLED"
};

const BLOCK_KIND_TO_DOMAIN: Record<
  PrismaBlockKind,
  "deliverable" | "milestone" | "decision" | "review" | "release"
> = {
  DELIVERABLE: "deliverable",
  MILESTONE: "milestone",
  DECISION: "decision",
  REVIEW: "review",
  RELEASE: "release"
};

const BLOCK_KIND_TO_PERSISTENCE: Record<
  "deliverable" | "milestone" | "decision" | "review" | "release",
  PrismaBlockKind
> = {
  deliverable: "DELIVERABLE",
  milestone: "MILESTONE",
  decision: "DECISION",
  review: "REVIEW",
  release: "RELEASE"
};

export function mapBlockRecordToDomain(record: PrismaBlockRecord) {
  return Block.create({
    id: record.id,
    projectId: record.projectId,
    parentBlockId: record.parentBlockId,
    title: record.title,
    summary: record.summary,
    expectedResult: record.expectedResult,
    definitionOfDone: record.definitionOfDoneItems.length > 0 ? record.definitionOfDoneItems : null,
    acceptanceCriteria: record.acceptanceCriteria,
    ownerId: record.ownerId,
    status: BLOCK_STATUS_TO_DOMAIN[record.status],
    blocker:
      record.blockerReason && record.blockerSource && record.unblockCondition
        ? {
            reason: record.blockerReason,
            source: record.blockerSource,
            unblockCondition: record.unblockCondition
          }
        : null,
    kind: BLOCK_KIND_TO_DOMAIN[record.kind],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  });
}

export function mapBlockDomainToPersistence(block: Block) {
  const snapshot = block.toSnapshot();

  return {
    id: snapshot.id,
    projectId: snapshot.projectId,
    parentBlockId: snapshot.parentBlockId,
    title: snapshot.title,
    summary: snapshot.summary,
    expectedResult: snapshot.expectedResult,
    definitionOfDoneItems: snapshot.definitionOfDone?.items ?? [],
    acceptanceCriteria: snapshot.acceptanceCriteria,
    ownerId: snapshot.ownerId,
    status: BLOCK_STATUS_TO_PERSISTENCE[snapshot.status],
    blockerReason: snapshot.blocker?.reason ?? null,
    blockerSource: snapshot.blocker?.source ?? null,
    unblockCondition: snapshot.blocker?.unblockCondition ?? null,
    kind: BLOCK_KIND_TO_PERSISTENCE[snapshot.kind],
    createdAt: snapshot.createdAt,
    updatedAt: snapshot.updatedAt
  };
}
