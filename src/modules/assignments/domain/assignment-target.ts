import { assertNonEmptyText } from "@/src/shared/domain";
import type { AssignmentTargetType } from "./assignment-role";

export class AssignmentTarget {
  readonly type: AssignmentTargetType;
  readonly projectId: string;
  readonly targetId: string;

  private constructor(type: AssignmentTargetType, projectId: string, targetId: string) {
    this.type = type;
    this.projectId = assertNonEmptyText(projectId, "projectId");
    this.targetId = assertNonEmptyText(targetId, "targetId");
  }

  static forProject(projectId: string) {
    return new AssignmentTarget("project", projectId, projectId);
  }

  static forBlock(projectId: string, blockId: string) {
    return new AssignmentTarget("block", projectId, blockId);
  }
}
