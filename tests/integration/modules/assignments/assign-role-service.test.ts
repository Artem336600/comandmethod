import { AssignRoleService, RevokeAssignmentService } from "@/src/modules/assignments/application";
import {
  InMemoryAssignmentHistoryRepository,
  InMemoryAssignmentRepository,
  InMemoryAssignmentUnitOfWork
} from "@/tests/setup/module-test-doubles";

describe("assignment workflows", () => {
  it("should create owner assignments and append audit history", async () => {
    const assignments = new InMemoryAssignmentRepository();
    const history = new InMemoryAssignmentHistoryRepository();
    const unitOfWork = new InMemoryAssignmentUnitOfWork(assignments, history);
    const service = new AssignRoleService(unitOfWork);

    const assignment = await service.execute({
      assignmentId: "assignment-owner",
      historyEntryId: "assignment-history-1",
      projectId: "project-1",
      blockId: "block-1",
      role: "owner",
      subjectUserId: "user-owner",
      assignedByUserId: "lead-user"
    });

    expect(assignment.id).toBe("assignment-owner");
    expect(history.entries).toHaveLength(1);
    expect(history.entries[0]).toMatchObject({
      assignmentId: "assignment-owner",
      eventType: "assigned"
    });
  });

  it("should reject reviewer assignment for the active owner", async () => {
    const assignments = new InMemoryAssignmentRepository();
    const history = new InMemoryAssignmentHistoryRepository();
    const unitOfWork = new InMemoryAssignmentUnitOfWork(assignments, history);
    const assignRole = new AssignRoleService(unitOfWork);

    await assignRole.execute({
      assignmentId: "assignment-owner",
      projectId: "project-1",
      blockId: "block-1",
      role: "owner",
      subjectUserId: "user-owner",
      assignedByUserId: "lead-user"
    });

    await expect(
      assignRole.execute({
        assignmentId: "assignment-reviewer",
        projectId: "project-1",
        blockId: "block-1",
        role: "reviewer",
        subjectUserId: "user-owner",
        assignedByUserId: "lead-user"
      })
    ).rejects.toThrow("A user cannot be both owner and reviewer on the same block.");
  });

  it("should revoke active assignments and append revoke history", async () => {
    const assignments = new InMemoryAssignmentRepository();
    const history = new InMemoryAssignmentHistoryRepository();
    const unitOfWork = new InMemoryAssignmentUnitOfWork(assignments, history);
    const assignRole = new AssignRoleService(unitOfWork);
    const revokeAssignment = new RevokeAssignmentService(unitOfWork);

    await assignRole.execute({
      assignmentId: "assignment-owner",
      historyEntryId: "assignment-history-1",
      projectId: "project-1",
      blockId: "block-1",
      role: "owner",
      subjectUserId: "user-owner",
      assignedByUserId: "lead-user"
    });

    const revokedAssignment = await revokeAssignment.execute({
      assignmentId: "assignment-owner",
      historyEntryId: "assignment-history-2",
      changedByUserId: "lead-user"
    });

    expect(revokedAssignment.revokedAt).not.toBeNull();
    expect(history.entries).toHaveLength(2);
    expect(history.entries[1]).toMatchObject({
      assignmentId: "assignment-owner",
      eventType: "revoked"
    });
  });
});
