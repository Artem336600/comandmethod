import { Project, ProjectSlug } from "@/src/modules/projects/domain";

describe("Project", () => {
  it("should reject matching start and finish anchor blocks", () => {
    expect(() =>
      Project.create({
        id: "project-1",
        name: "Core graph workspace",
        slug: "core-graph-workspace",
        startBlockId: "block-anchor",
        finishBlockId: "block-anchor"
      })
    ).toThrow("Project start and finish anchors must reference different blocks.");
  });

  it("should archive a project with an archived timestamp", () => {
    const project = Project.create({
      id: "project-1",
      name: "Core graph workspace",
      slug: "core-graph-workspace"
    });

    const archivedAt = new Date("2026-03-11T12:00:00.000Z");
    const archivedProject = project.archive(archivedAt).toSnapshot();

    expect(archivedProject.status).toBe("archived");
    expect(archivedProject.archivedAt).toEqual(archivedAt);
  });

  it("should normalize project slugs to lowercase", () => {
    const slug = ProjectSlug.create("Core-Domain-Model");

    expect(slug.value).toBe("core-domain-model");
  });
});
