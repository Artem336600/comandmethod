import { resolveWorkspaceProjectSelection } from "@/src/modules/projects/application";

describe("resolveWorkspaceProjectSelection", () => {
  const projects = [
    {
      id: "project-1",
      name: "Alpha",
      slug: "alpha",
      status: "active" as const,
      description: "Alpha project",
      startBlockId: null,
      finishBlockId: null,
      createdAt: new Date("2026-03-11T09:00:00.000Z"),
      updatedAt: new Date("2026-03-11T09:00:00.000Z")
    },
    {
      id: "project-2",
      name: "Beta",
      slug: "beta",
      status: "draft" as const,
      description: "Beta project",
      startBlockId: null,
      finishBlockId: null,
      createdAt: new Date("2026-03-11T10:00:00.000Z"),
      updatedAt: new Date("2026-03-11T10:00:00.000Z")
    }
  ];

  it("should redirect to the first accessible project when no slug is requested", () => {
    expect(
      resolveWorkspaceProjectSelection({
        projects
      })
    ).toMatchObject({
      state: "redirect",
      redirectToSlug: "alpha"
    });
  });

  it("should resolve the requested accessible project slug", () => {
    expect(
      resolveWorkspaceProjectSelection({
        projects,
        requestedProjectSlug: "beta"
      })
    ).toMatchObject({
      state: "resolved",
      redirectToSlug: null,
      selectedProject: {
        id: "project-2",
        slug: "beta"
      }
    });
  });

  it("should redirect unknown slugs to the default accessible project", () => {
    expect(
      resolveWorkspaceProjectSelection({
        projects,
        requestedProjectSlug: "gamma"
      })
    ).toMatchObject({
      state: "redirect",
      redirectToSlug: "alpha",
      requestedProjectSlug: "gamma"
    });
  });

  it("should return an empty selection when no projects are accessible", () => {
    expect(
      resolveWorkspaceProjectSelection({
        projects: [],
        requestedProjectSlug: "alpha"
      })
    ).toEqual({
      requestedProjectSlug: "alpha",
      selectedProject: null,
      redirectToSlug: null,
      state: "empty"
    });
  });
});
