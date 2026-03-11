import { ChangeBlockStatusService } from "@/src/modules/blocks/application";
import {
  InMemoryBlockRepository,
  InMemoryBlockStatusHistoryRepository,
  InMemoryBlockStatusTransitionUnitOfWork,
  createExecutableBlock
} from "@/tests/setup/module-test-doubles";

describe("ChangeBlockStatusService", () => {
  it("should persist blocked status changes and append history", async () => {
    const blocks = new InMemoryBlockRepository([createExecutableBlock()]);
    const history = new InMemoryBlockStatusHistoryRepository();
    const unitOfWork = new InMemoryBlockStatusTransitionUnitOfWork(blocks, history);
    const service = new ChangeBlockStatusService(unitOfWork);

    const updatedBlock = await service.execute({
      blockId: "block-1",
      nextStatus: "blocked",
      changedByUserId: "lead-user",
      reason: "Backend is unavailable.",
      blocker: {
        reason: "Waiting on backend dependency",
        source: "API platform",
        unblockCondition: "Webhook contract is published"
      }
    });

    expect(updatedBlock.status).toBe("blocked");
    expect(history.entries).toHaveLength(1);
    expect(history.entries[0]).toMatchObject({
      blockId: "block-1",
      fromStatus: "ready",
      toStatus: "blocked",
      eventType: "status_changed"
    });
  });

  it("should reject status changes for missing blocks", async () => {
    const unitOfWork = new InMemoryBlockStatusTransitionUnitOfWork(
      new InMemoryBlockRepository(),
      new InMemoryBlockStatusHistoryRepository()
    );
    const service = new ChangeBlockStatusService(unitOfWork);

    await expect(
      service.execute({
        blockId: "missing-block",
        nextStatus: "done",
        changedByUserId: "lead-user"
      })
    ).rejects.toThrow("Block not found.");
  });
});
