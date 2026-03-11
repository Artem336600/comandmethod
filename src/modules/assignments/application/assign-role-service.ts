import { randomUUID } from "node:crypto";
import { createModuleLogger } from "@/src/shared/lib";
import {
  Assignment,
  AssignmentHistoryEntry,
  AssignmentPolicy,
  AssignmentTarget,
  type AssignmentRole
} from "@/src/modules/assignments/domain";
import type { AssignmentUnitOfWork } from "./assignment-unit-of-work";

const logger = createModuleLogger("assignments/application/assign-role-service");

export type AssignRoleInput = {
  assignmentId?: string;
  historyEntryId?: string;
  projectId: string;
  blockId?: string | null;
  role: AssignmentRole;
  subjectUserId: string;
  assignedByUserId: string;
  createdAt?: Date;
};

export class AssignRoleService {
  constructor(private readonly unitOfWork: AssignmentUnitOfWork) {}

  async execute(input: AssignRoleInput) {
    logger.debug("[AssignRoleService.execute] Creating assignment", {
      projectId: input.projectId,
      blockId: input.blockId ?? null,
      role: input.role,
      subjectUserId: input.subjectUserId,
      assignedByUserId: input.assignedByUserId
    });

    const target = input.blockId
      ? AssignmentTarget.forBlock(input.projectId, input.blockId)
      : AssignmentTarget.forProject(input.projectId);

    return this.unitOfWork.run(async ({ assignments, assignmentHistory }) => {
      const existingAssignments = await assignments.listByTarget(target);
      const activeAssignments = existingAssignments.filter((assignment) => assignment.revokedAt === null);

      AssignmentPolicy.assertNoDuplicateActiveAssignment(
        activeAssignments,
        input.role,
        input.subjectUserId
      );

      if (target.type === "block") {
        AssignmentPolicy.assertSingleOwner(activeAssignments, input.role, input.subjectUserId);
        AssignmentPolicy.assertNoOwnerReviewerConflict(
          activeAssignments,
          input.role,
          input.subjectUserId
        );
      }

      const createdAt = input.createdAt ?? new Date();
      const assignment = Assignment.create({
        id: input.assignmentId ?? randomUUID(),
        target,
        role: input.role,
        subjectUserId: input.subjectUserId,
        assignedByUserId: input.assignedByUserId,
        createdAt
      });

      await assignments.save(assignment);

      const historyEntry = AssignmentHistoryEntry.create({
        id: input.historyEntryId ?? randomUUID(),
        assignmentId: assignment.id,
        target,
        role: assignment.role,
        subjectUserId: assignment.subjectUserId,
        changedByUserId: input.assignedByUserId,
        eventType: "assigned",
        occurredAt: createdAt
      });

      await assignmentHistory.append(historyEntry);

      logger.info("[AssignRoleService.execute] Assignment created", {
        assignmentId: assignment.id,
        projectId: target.projectId,
        targetType: target.type,
        targetId: target.targetId,
        role: assignment.role
      });

      return assignment;
    });
  }
}
