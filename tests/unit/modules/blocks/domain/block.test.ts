import { Block } from "@/src/modules/blocks/domain";

describe("Block", () => {
  it("should reject leaving draft without owner, expected result, and definition of done", () => {
    expect(() =>
      Block.create({
        id: "block-1",
        projectId: "project-1",
        title: "Onboarding flow delivered",
        status: "ready"
      })
    ).toThrow("A block must have an owner before leaving draft.");
  });

  it("should reject titles that describe an activity instead of a completed result", () => {
    expect(() =>
      Block.create({
        id: "block-1",
        projectId: "project-1",
        title: "Implement onboarding flow"
      })
    ).toThrow("Block titles must describe a completed result, not an activity.");
  });

  it("should reject blocked blocks without blocker details", () => {
    expect(() =>
      Block.create({
        id: "block-1",
        projectId: "project-1",
        title: "Onboarding flow delivered",
        status: "blocked",
        ownerId: "user-owner",
        expectedResult: "New teams complete onboarding.",
        definitionOfDone: ["QA approved"]
      })
    ).toThrow("Blocked blocks require blocker details.");
  });

  it("should persist definition of done and acceptance criteria in the snapshot", () => {
    const block = Block.create({
      id: "block-1",
      projectId: "project-1",
      title: "Onboarding flow delivered",
      ownerId: "user-owner",
      status: "ready",
      expectedResult: "New teams complete onboarding.",
      definitionOfDone: ["QA approved", "Docs updated"],
      acceptanceCriteria: ["Supports admins", "Supports members"]
    });

    expect(block.toSnapshot().definitionOfDone?.items).toEqual(["QA approved", "Docs updated"]);
    expect(block.toSnapshot().acceptanceCriteria).toEqual(["Supports admins", "Supports members"]);
  });
});
