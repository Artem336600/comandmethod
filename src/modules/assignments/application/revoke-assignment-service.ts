import { randomUUID } from "node:crypto";
import { DomainValidationError } from "@/src/shared/domain";
import { createModuleLogger } from "@/src/shared/lib";
import { AssignmentHistoryEntry } from "@/src/modules/assignments/domain";
import type { AssignmentUnitOfWork } from "./assignment-unit-of-work";

const logger = createModuleLogger("assignments/application/revoke-assignment-service");

export type RevokeAssignmentInput = {
  assignmentId: string;
  historyEntryId?: string;
  changedByUserId: string;
  revokedAt?: Date;
};

export class RevokeAssignmentService {
  constructor(private readonly unitOfWork: AssignmentUnitOfWork) {}

  async execute(input: RevokeAssignmentInput) {
    logger.debug("[RevokeAssignmentService.execute] Revoking assignment", {
      assignmentId: input.assignmentId,
      changedByUserId: input.changedByUserId
    });

    return this.unitOfWork.run(async ({ assignments, assignmentHistory }) => {
      const assignment = await assignments.findById(input.assignmentId);

      if (!assignment) {
        logger.warn("[RevokeAssignmentService.execute] Assignment not found", {
          assignmentId: input.assignmentId
        });
        throw new DomainValidationError("Assignment not found.", { assignmentId: input.assignmentId });
      }

      if (assignment.revokedAt) {
        logger.warn("[RevokeAssignmentService.execute] Assignment already revoked", {
          assignmentId: assignment.id,
          revokedAt: assignment.revokedAt.toISOString()
        });
        return assignment;
      }

      const revokedAt = input.revokedAt ?? new Date();
      const revokedAssignment = assignment.revoke(revokedAt);

      await assignments.save(revokedAssignment);

      const historyEntry = AssignmentHistoryEntry.create({
        id: input.historyEntryId ?? randomUUID(),
        assignmentId: revokedAssignment.id,
        target: revokedAssignment.target,
        role: revokedAssignment.role,
        subjectUserId: revokedAssignment.subjectUserId,
        changedByUserId: input.changedByUserId,
        eventType: "revoked",
        occurredAt: revokedAt
      });

      await assignmentHistory.append(historyEntry);

      logger.info("[RevokeAssignmentService.execute] Assignment revoked", {
        assignmentId: revokedAssignment.id,
        targetType: revokedAssignment.target.type,
        targetId: revokedAssignment.target.targetId
      });

      return revokedAssignment;
    });
  }
}
