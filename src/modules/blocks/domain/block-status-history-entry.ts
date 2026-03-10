import { DomainValidationError, assertMaxLength, assertNonEmptyText, assertOptionalText } from "@/src/shared/domain";
import { BlockerDetails } from "./blocker-details";
import type { BlockStatus } from "./block-status";

export const BLOCK_STATUS_HISTORY_EVENT_TYPES = ["status_changed", "status_backfilled"] as const;

export type BlockStatusHistoryEventType = (typeof BLOCK_STATUS_HISTORY_EVENT_TYPES)[number];

export class BlockStatusHistoryEntry {
  readonly id: string;
  readonly blockId: string;
  readonly fromStatus: BlockStatus | null;
  readonly toStatus: BlockStatus;
  readonly changedByUserId: string;
  readonly eventType: BlockStatusHistoryEventType;
  readonly reason: string | null;
  readonly blocker: BlockerDetails | null;
  readonly occurredAt: Date;

  private constructor(props: {
    id: string;
    blockId: string;
    fromStatus: BlockStatus | null;
    toStatus: BlockStatus;
    changedByUserId: string;
    eventType: BlockStatusHistoryEventType;
    reason: string | null;
    blocker: BlockerDetails | null;
    occurredAt: Date;
  }) {
    if (props.toStatus === "blocked" && !props.blocker) {
      throw new DomainValidationError("Blocked status history entries require blocker details.", {
        blockId: props.blockId
      });
    }

    this.id = assertNonEmptyText(props.id, "blockStatusHistoryEntryId");
    this.blockId = assertNonEmptyText(props.blockId, "blockId");
    this.fromStatus = props.fromStatus;
    this.toStatus = props.toStatus;
    this.changedByUserId = assertNonEmptyText(props.changedByUserId, "changedByUserId");
    this.eventType = props.eventType;
    this.reason = normalizeHistoryReason(props.reason);
    this.blocker = props.blocker;
    this.occurredAt = props.occurredAt;
  }

  static create(props: {
    id: string;
    blockId: string;
    fromStatus: BlockStatus | null;
    toStatus: BlockStatus;
    changedByUserId: string;
    eventType?: BlockStatusHistoryEventType;
    reason?: string | null;
    blocker?: BlockerDetails | null;
    occurredAt?: Date;
  }) {
    return new BlockStatusHistoryEntry({
      ...props,
      eventType: props.eventType ?? "status_changed",
      reason: props.reason ?? null,
      blocker: props.blocker ?? null,
      occurredAt: props.occurredAt ?? new Date()
    });
  }
}

function normalizeHistoryReason(value: string | null | undefined) {
  const normalized = assertOptionalText(value, "statusChangeReason");
  return normalized ? assertMaxLength(normalized, "statusChangeReason", 500) : null;
}
