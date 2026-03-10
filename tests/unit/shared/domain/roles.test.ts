import { getPrimaryRoleLabel, hasWorkspaceAccess } from "@/src/shared/domain";

describe("roles", () => {
  it("should report workspace access when at least one role exists", () => {
    expect(hasWorkspaceAccess(["member"])).toBe(true);
  });

  it("should report no access when roles are empty", () => {
    expect(hasWorkspaceAccess([])).toBe(false);
  });

  it("should use the first role as the primary label", () => {
    expect(getPrimaryRoleLabel(["lead", "member"])).toBe("lead");
  });
});
