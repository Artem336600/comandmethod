import { mapBlockDomainToPersistence, mapBlockRecordToDomain } from "@/src/modules/blocks/infrastructure";
import { createExecutableBlock } from "@/tests/setup/module-test-doubles";

describe("block Prisma mapper", () => {
  it("should map domain blocks to Prisma persistence shape", () => {
    const block = createExecutableBlock({
      blocker: {
        reason: "Waiting on backend dependency",
        source: "API platform",
        unblockCondition: "Webhook contract is published"
      },
      status: "blocked"
    });

    expect(mapBlockDomainToPersistence(block)).toMatchObject({
      id: "block-1",
      status: "BLOCKED",
      blockerReason: "Waiting on backend dependency",
      blockerSource: "API platform",
      unblockCondition: "Webhook contract is published"
    });
  });

  it("should map Prisma records back into the block domain", () => {
    const block = mapBlockRecordToDomain({
      id: "block-1",
      projectId: "project-1",
      parentBlockId: null,
      title: "Onboarding flow delivered",
      summary: "Ship the onboarding flow for new teams.",
      expectedResult: "Teams can complete onboarding end-to-end.",
      definitionOfDoneItems: ["QA approved", "Docs updated"],
      acceptanceCriteria: ["Tracks completion state"],
      ownerId: "user-owner",
      status: "READY",
      blockerReason: null,
      blockerSource: null,
      unblockCondition: null,
      kind: "DELIVERABLE",
      createdAt: new Date("2026-03-11T09:00:00.000Z"),
      updatedAt: new Date("2026-03-11T09:00:00.000Z")
    });

    expect(block.toSnapshot()).toMatchObject({
      id: "block-1",
      status: "ready",
      kind: "deliverable",
      ownerId: "user-owner"
    });
    expect(block.toSnapshot().definitionOfDone?.items).toEqual(["QA approved", "Docs updated"]);
  });
});
