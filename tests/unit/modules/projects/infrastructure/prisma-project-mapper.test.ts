import { mapProjectDomainToPersistence, mapProjectRecordToDomain } from "@/src/modules/projects/infrastructure";
import { Project } from "@/src/modules/projects/domain";

describe("project Prisma mapper", () => {
  it("should map domain snapshots to Prisma persistence shape", () => {
    const project = Project.create({
      id: "project-1",
      name: "Core graph workspace",
      slug: "core-graph-workspace",
      description: "Primary project for the graph MVP.",
      status: "active",
      startBlockId: "block-start",
      finishBlockId: "block-finish",
      createdAt: new Date("2026-03-11T09:00:00.000Z"),
      updatedAt: new Date("2026-03-11T10:00:00.000Z")
    });

    expect(mapProjectDomainToPersistence(project)).toMatchObject({
      id: "project-1",
      slug: "core-graph-workspace",
      status: "ACTIVE",
      startBlockId: "block-start",
      finishBlockId: "block-finish"
    });
  });

  it("should map Prisma records back into the project domain", () => {
    const project = mapProjectRecordToDomain({
      id: "project-1",
      name: "Core graph workspace",
      slug: "core-graph-workspace",
      description: "Primary project for the graph MVP.",
      status: "ACTIVE",
      startBlockId: "block-start",
      finishBlockId: "block-finish",
      createdAt: new Date("2026-03-11T09:00:00.000Z"),
      updatedAt: new Date("2026-03-11T10:00:00.000Z"),
      archivedAt: null
    });

    expect(project.toSnapshot()).toMatchObject({
      id: "project-1",
      status: "active",
      startBlockId: "block-start",
      finishBlockId: "block-finish"
    });
  });
});
