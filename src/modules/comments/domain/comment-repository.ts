import { Comment } from "./comment";
import { CommentTarget } from "./comment-target";

export interface CommentRepository {
  save(comment: Comment): Promise<void>;
  findById(commentId: string): Promise<Comment | null>;
  listByTarget(target: CommentTarget): Promise<Comment[]>;
}
