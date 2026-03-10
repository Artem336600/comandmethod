import { assertMaxLength, assertNonEmptyText } from "@/src/shared/domain";

export class CommentPolicy {
  static normalizeBody(body: string): string {
    return assertMaxLength(assertNonEmptyText(body, "commentBody"), "commentBody", 4000);
  }
}
