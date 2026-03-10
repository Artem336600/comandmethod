import { randomUUID } from "node:crypto";
import { Comment, CommentTarget } from "@/src/modules/comments/domain";
import type { CommentRepository } from "@/src/modules/comments/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("comments/application/add-comment-service");

export type AddCommentInput = {
  commentId?: string;
  projectId: string;
  blockId?: string | null;
  authorUserId: string;
  body: string;
  createdAt?: Date;
};

export class AddCommentService {
  constructor(private readonly comments: CommentRepository) {}

  async execute(input: AddCommentInput) {
    logger.debug("[AddCommentService.execute] Creating comment", {
      projectId: input.projectId,
      blockId: input.blockId ?? null,
      authorUserId: input.authorUserId
    });

    const comment = Comment.create({
      id: input.commentId ?? randomUUID(),
      target: input.blockId
        ? CommentTarget.forBlock(input.projectId, input.blockId)
        : CommentTarget.forProject(input.projectId),
      authorUserId: input.authorUserId,
      body: input.body,
      createdAt: input.createdAt
    });

    await this.comments.save(comment);

    logger.info("[AddCommentService.execute] Comment created", {
      commentId: comment.id,
      targetType: comment.target.type,
      targetId: comment.target.targetId
    });

    return comment;
  }
}
