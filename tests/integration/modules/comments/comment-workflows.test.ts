import { AddCommentService, ListTargetCommentsService } from "@/src/modules/comments/application";
import { InMemoryCommentRepository } from "@/tests/setup/module-test-doubles";

describe("comment workflows", () => {
  it("should create and list comments for a block target", async () => {
    const comments = new InMemoryCommentRepository();
    const addComment = new AddCommentService(comments);
    const listComments = new ListTargetCommentsService(comments);

    await addComment.execute({
      commentId: "comment-1",
      projectId: "project-1",
      blockId: "block-1",
      authorUserId: "user-author",
      body: "Waiting on API feedback before final QA."
    });

    const result = await listComments.execute({
      projectId: "project-1",
      blockId: "block-1"
    });

    expect(result).toEqual([
      expect.objectContaining({
        id: "comment-1",
        targetType: "block",
        targetId: "block-1",
        authorUserId: "user-author"
      })
    ]);
  });
});
