import { CreateBlockDependencyService } from "@/src/modules/graph/application";
import { BlockDependency } from "@/src/modules/graph/domain";
import { InMemoryGraphRepository } from "@/tests/setup/module-test-doubles";

describe("CreateBlockDependencyService", () => {
  it("should persist a valid dependency", async () => {
    const graph = new InMemoryGraphRepository();
    const service = new CreateBlockDependencyService(graph);

    const dependency = await service.execute({
      dependencyId: "dependency-1",
      projectId: "project-1",
      predecessorBlockId: "block-a",
      successorBlockId: "block-b"
    });

    expect(dependency.id).toBe("dependency-1");
    await expect(graph.listDependenciesByProjectId("project-1")).resolves.toHaveLength(1);
  });

  it("should reject dependencies that would create a cycle", async () => {
    const graph = new InMemoryGraphRepository();
    await graph.saveDependency(
      BlockDependency.create({
        id: "dependency-existing",
        projectId: "project-1",
        predecessorBlockId: "block-b",
        successorBlockId: "block-a"
      })
    );

    const service = new CreateBlockDependencyService(graph);

    await expect(
      service.execute({
        dependencyId: "dependency-1",
        projectId: "project-1",
        predecessorBlockId: "block-a",
        successorBlockId: "block-b"
      })
    ).rejects.toThrow("A dependency cycle was detected.");
  });
});
