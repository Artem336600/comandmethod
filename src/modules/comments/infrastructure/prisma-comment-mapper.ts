import type { Comment as PrismaCommentRecord } from "@prisma/client";
import { Comment, CommentTarget } from "@/src/modules/comments/domain";

export function mapCommentRecordToDomain(record: PrismaCommentRecord) {
  return Comment.create({
    id: record.id,
    target: record.blockId
      ? CommentTarget.forBlock(record.projectId, record.blockId)
      : CommentTarget.forProject(record.projectId),
    authorUserId: record.authorUserId,
    body: record.body,
    createdAt: record.createdAt,
    editedAt: record.editedAt
  });
}

export function mapCommentDomainToPersistence(comment: Comment) {
  return {
    id: comment.id,
    projectId: comment.target.projectId,
    blockId: comment.target.type === "block" ? comment.target.targetId : null,
    authorUserId: comment.authorUserId,
    body: comment.body,
    createdAt: comment.createdAt,
    editedAt: comment.editedAt
  };
}
