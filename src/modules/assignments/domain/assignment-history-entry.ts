import { assertNonEmptyText } from "@/src/shared/domain";
import { AssignmentTarget } from "./assignment-target";
import type { AssignmentRole } from "./assignment-role";

export const ASSIGNMENT_HISTORY_EVENT_TYPES = ["assigned", "revoked"] as const;

export type AssignmentHistoryEventType = (typeof ASSIGNMENT_HISTORY_EVENT_TYPES)[number];

export class AssignmentHistoryEntry {
  readonly id: string;
  readonly assignmentId: string;
  readonly target: AssignmentTarget;
  readonly role: AssignmentRole;
  readonly subjectUserId: string;
  readonly changedByUserId: string;
  readonly eventType: AssignmentHistoryEventType;
  readonly occurredAt: Date;

  private constructor(props: {
    id: string;
    assignmentId: string;
    target: AssignmentTarget;
    role: AssignmentRole;
    subjectUserId: string;
    changedByUserId: string;
    eventType: AssignmentHistoryEventType;
    occurredAt: Date;
  }) {
    this.id = assertNonEmptyText(props.id, "assignmentHistoryEntryId");
    this.assignmentId = assertNonEmptyText(props.assignmentId, "assignmentId");
    this.target = props.target;
    this.role = props.role;
    this.subjectUserId = assertNonEmptyText(props.subjectUserId, "subjectUserId");
    this.changedByUserId = assertNonEmptyText(props.changedByUserId, "changedByUserId");
    this.eventType = props.eventType;
    this.occurredAt = props.occurredAt;
  }

  static create(props: {
    id: string;
    assignmentId: string;
    target: AssignmentTarget;
    role: AssignmentRole;
    subjectUserId: string;
    changedByUserId: string;
    eventType: AssignmentHistoryEventType;
    occurredAt?: Date;
  }) {
    return new AssignmentHistoryEntry({
      ...props,
      occurredAt: props.occurredAt ?? new Date()
    });
  }
}
