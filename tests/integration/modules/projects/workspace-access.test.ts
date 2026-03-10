import { buildWorkspaceAccessViewModel } from "@/src/modules/projects/application";

describe("buildWorkspaceAccessViewModel", () => {
  it("should project the workspace identity for valid sessions", () => {
    expect(
      buildWorkspaceAccessViewModel({
        userId: "user-1",
        email: "dev@commandmethod.local",
        displayName: "Dev Lead",
        roles: ["lead"]
      })
    ).toEqual({
      displayName: "Dev Lead",
      email: "dev@commandmethod.local",
      primaryRole: "lead"
    });
  });

  it("should reject sessions without workspace roles", () => {
    expect(() =>
      buildWorkspaceAccessViewModel({
        userId: "user-2",
        email: "viewer@commandmethod.local",
        displayName: "No Role",
        roles: []
      })
    ).toThrow("Workspace access denied.");
  });
});
