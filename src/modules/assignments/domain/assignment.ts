import { assertNonEmptyText } from "@/src/shared/domain";
import { AssignmentPolicy } from "./assignment-policy";
import { AssignmentTarget } from "./assignment-target";
import type { AssignmentRole } from "./assignment-role";

export class Assignment {
  readonly id: string;
  readonly target: AssignmentTarget;
  readonly role: AssignmentRole;
  readonly subjectUserId: string;
  readonly assignedByUserId: string;
  readonly createdAt: Date;
  readonly revokedAt: Date | null;

  private constructor(props: {
    id: string;
    target: AssignmentTarget;
    role: AssignmentRole;
    subjectUserId: string;
    assignedByUserId: string;
    createdAt: Date;
    revokedAt: Date | null;
  }) {
    AssignmentPolicy.assertRoleAllowed(props.target.type, props.role);

    this.id = assertNonEmptyText(props.id, "assignmentId");
    this.target = props.target;
    this.role = props.role;
    this.subjectUserId = assertNonEmptyText(props.subjectUserId, "subjectUserId");
    this.assignedByUserId = assertNonEmptyText(props.assignedByUserId, "assignedByUserId");
    this.createdAt = props.createdAt;
    this.revokedAt = props.revokedAt;
  }

  static create(props: {
    id: string;
    target: AssignmentTarget;
    role: AssignmentRole;
    subjectUserId: string;
    assignedByUserId: string;
    createdAt?: Date;
    revokedAt?: Date | null;
  }) {
    return new Assignment({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      revokedAt: props.revokedAt ?? null
    });
  }

  revoke(revokedAt = new Date()) {
    return new Assignment({
      ...this,
      revokedAt
    });
  }
}
