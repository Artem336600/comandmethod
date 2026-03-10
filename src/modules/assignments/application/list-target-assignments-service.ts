import { AssignmentTarget } from "@/src/modules/assignments/domain";
import type { AssignmentRepository } from "@/src/modules/assignments/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("assignments/application/list-target-assignments-service");

export type AssignmentReadModel = {
  id: string;
  targetType: "project" | "block";
  targetId: string;
  projectId: string;
  role: "admin" | "pm" | "lead" | "member" | "viewer" | "owner" | "assignee" | "reviewer" | "watcher";
  subjectUserId: string;
  assignedByUserId: string;
  createdAt: Date;
  revokedAt: Date | null;
};

export class ListTargetAssignmentsService {
  constructor(private readonly assignments: AssignmentRepository) {}

  async execute(input: { projectId: string; blockId?: string | null; includeRevoked?: boolean }) {
    logger.debug("[ListTargetAssignmentsService.execute] Listing assignments for target", {
      projectId: input.projectId,
      blockId: input.blockId ?? null,
      includeRevoked: input.includeRevoked ?? false
    });

    const target = input.blockId
      ? AssignmentTarget.forBlock(input.projectId, input.blockId)
      : AssignmentTarget.forProject(input.projectId);

    const assignments = await this.assignments.listByTarget(target);
    const filteredAssignments = (input.includeRevoked ?? false)
      ? assignments
      : assignments.filter((assignment) => assignment.revokedAt === null);

    const result = filteredAssignments.map((assignment) => ({
      id: assignment.id,
      targetType: assignment.target.type,
      targetId: assignment.target.targetId,
      projectId: assignment.target.projectId,
      role: assignment.role,
      subjectUserId: assignment.subjectUserId,
      assignedByUserId: assignment.assignedByUserId,
      createdAt: assignment.createdAt,
      revokedAt: assignment.revokedAt
    } satisfies AssignmentReadModel));

    logger.info("[ListTargetAssignmentsService.execute] Assignments listed", {
      projectId: input.projectId,
      blockId: input.blockId ?? null,
      count: result.length
    });

    return result;
  }
}
