import { CommentTarget } from "@/src/modules/comments/domain";
import type { CommentRepository } from "@/src/modules/comments/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("comments/application/list-target-comments-service");

export type CommentReadModel = {
  id: string;
  targetType: "project" | "block";
  targetId: string;
  projectId: string;
  authorUserId: string;
  body: string;
  createdAt: Date;
  editedAt: Date | null;
};

export class ListTargetCommentsService {
  constructor(private readonly comments: CommentRepository) {}

  async execute(input: { projectId: string; blockId?: string | null }) {
    logger.debug("[ListTargetCommentsService.execute] Listing comments for target", {
      projectId: input.projectId,
      blockId: input.blockId ?? null
    });

    const target = input.blockId
      ? CommentTarget.forBlock(input.projectId, input.blockId)
      : CommentTarget.forProject(input.projectId);

    const comments = await this.comments.listByTarget(target);
    const result = comments.map((comment) => ({
      id: comment.id,
      targetType: comment.target.type,
      targetId: comment.target.targetId,
      projectId: comment.target.projectId,
      authorUserId: comment.authorUserId,
      body: comment.body,
      createdAt: comment.createdAt,
      editedAt: comment.editedAt
    } satisfies CommentReadModel));

    logger.info("[ListTargetCommentsService.execute] Comments listed", {
      projectId: input.projectId,
      blockId: input.blockId ?? null,
      count: result.length
    });

    return result;
  }
}
