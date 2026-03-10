import { assertMaxLength, assertNonEmptyText } from "@/src/shared/domain";

export class BlockerDetails {
  readonly reason: string;
  readonly source: string;
  readonly unblockCondition: string;

  private constructor(reason: string, source: string, unblockCondition: string) {
    this.reason = reason;
    this.source = source;
    this.unblockCondition = unblockCondition;
  }

  static create(input: { reason: string; source: string; unblockCondition: string }) {
    return new BlockerDetails(
      assertMaxLength(assertNonEmptyText(input.reason, "blockerReason"), "blockerReason", 500),
      assertMaxLength(assertNonEmptyText(input.source, "blockerSource"), "blockerSource", 200),
      assertMaxLength(assertNonEmptyText(input.unblockCondition, "unblockCondition"), "unblockCondition", 500)
    );
  }
}
