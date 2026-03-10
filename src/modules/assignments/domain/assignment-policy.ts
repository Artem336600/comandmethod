import { DomainValidationError } from "@/src/shared/domain";
import { APP_ROLES } from "@/src/shared/domain";
import type { Assignment } from "./assignment";
import { BLOCK_ASSIGNMENT_ROLES } from "./assignment-role";
import type { AssignmentRole, AssignmentTargetType } from "./assignment-role";

const ALLOWED_PROJECT_ROLES = new Set<string>(APP_ROLES);
const ALLOWED_BLOCK_ROLES = new Set<string>(BLOCK_ASSIGNMENT_ROLES);

export class AssignmentPolicy {
  static assertRoleAllowed(targetType: AssignmentTargetType, role: AssignmentRole): void {
    const isAllowed =
      targetType === "project" ? ALLOWED_PROJECT_ROLES.has(role) : ALLOWED_BLOCK_ROLES.has(role);

    if (!isAllowed) {
      throw new DomainValidationError("Assignment role is not valid for the selected target.", {
        targetType,
        role
      });
    }
  }

  static assertNoDuplicateActiveAssignment(
    assignments: readonly Assignment[],
    role: AssignmentRole,
    subjectUserId: string
  ): void {
    const duplicate = assignments.find(
      (assignment) =>
        assignment.revokedAt === null &&
        assignment.role === role &&
        assignment.subjectUserId === subjectUserId
    );

    if (duplicate) {
      throw new DomainValidationError("An active assignment with the same role already exists.", {
        assignmentId: duplicate.id,
        role,
        subjectUserId
      });
    }
  }

  static assertNoOwnerReviewerConflict(
    assignments: readonly Assignment[],
    role: AssignmentRole,
    subjectUserId: string
  ): void {
    if (role !== "owner" && role !== "reviewer") {
      return;
    }

    const conflictingRole = role === "owner" ? "reviewer" : "owner";
    const conflict = assignments.find(
      (assignment) =>
        assignment.revokedAt === null &&
        assignment.subjectUserId === subjectUserId &&
        assignment.role === conflictingRole
    );

    if (conflict) {
      throw new DomainValidationError("A user cannot be both owner and reviewer on the same block.", {
        assignmentId: conflict.id,
        subjectUserId,
        conflictingRole
      });
    }
  }

  static assertSingleOwner(assignments: readonly Assignment[], role: AssignmentRole, subjectUserId: string): void {
    if (role !== "owner") {
      return;
    }

    const existingOwner = assignments.find(
      (assignment) =>
        assignment.revokedAt === null &&
        assignment.role === "owner" &&
        assignment.subjectUserId !== subjectUserId
    );

    if (existingOwner) {
      throw new DomainValidationError("A block can only have one active owner.", {
        assignmentId: existingOwner.id,
        subjectUserId: existingOwner.subjectUserId
      });
    }
  }
}
