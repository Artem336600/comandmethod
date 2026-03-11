import { Assignment, AssignmentPolicy, AssignmentTarget } from "@/src/modules/assignments/domain";

describe("AssignmentPolicy", () => {
  const target = AssignmentTarget.forBlock("project-1", "block-1");

  it("should reject a second active owner on the same block", () => {
    const activeOwner = Assignment.create({
      id: "assignment-owner",
      target,
      role: "owner",
      subjectUserId: "user-owner",
      assignedByUserId: "lead-user"
    });

    expect(() =>
      AssignmentPolicy.assertSingleOwner([activeOwner], "owner", "different-user")
    ).toThrow("A block can only have one active owner.");
  });

  it("should reject owner and reviewer role conflicts for the same user", () => {
    const reviewer = Assignment.create({
      id: "assignment-reviewer",
      target,
      role: "reviewer",
      subjectUserId: "user-1",
      assignedByUserId: "lead-user"
    });

    expect(() =>
      AssignmentPolicy.assertNoOwnerReviewerConflict([reviewer], "owner", "user-1")
    ).toThrow("A user cannot be both owner and reviewer on the same block.");
  });
});
