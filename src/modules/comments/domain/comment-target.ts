import { assertNonEmptyText } from "@/src/shared/domain";

export const COMMENT_TARGET_TYPES = ["project", "block"] as const;

export type CommentTargetType = (typeof COMMENT_TARGET_TYPES)[number];

export class CommentTarget {
  readonly type: CommentTargetType;
  readonly projectId: string;
  readonly targetId: string;

  private constructor(type: CommentTargetType, projectId: string, targetId: string) {
    this.type = type;
    this.projectId = assertNonEmptyText(projectId, "projectId");
    this.targetId = assertNonEmptyText(targetId, "targetId");
  }

  static forProject(projectId: string) {
    return new CommentTarget("project", projectId, projectId);
  }

  static forBlock(projectId: string, blockId: string) {
    return new CommentTarget("block", projectId, blockId);
  }
}
