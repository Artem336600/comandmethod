import { assertNonEmptyText } from "@/src/shared/domain";
import { CommentPolicy } from "./comment-policy";
import { CommentTarget } from "./comment-target";

export class Comment {
  readonly id: string;
  readonly target: CommentTarget;
  readonly authorUserId: string;
  readonly body: string;
  readonly createdAt: Date;
  readonly editedAt: Date | null;

  private constructor(props: {
    id: string;
    target: CommentTarget;
    authorUserId: string;
    body: string;
    createdAt: Date;
    editedAt: Date | null;
  }) {
    this.id = assertNonEmptyText(props.id, "commentId");
    this.target = props.target;
    this.authorUserId = assertNonEmptyText(props.authorUserId, "authorUserId");
    this.body = CommentPolicy.normalizeBody(props.body);
    this.createdAt = props.createdAt;
    this.editedAt = props.editedAt;
  }

  static create(props: {
    id: string;
    target: CommentTarget;
    authorUserId: string;
    body: string;
    createdAt?: Date;
    editedAt?: Date | null;
  }) {
    return new Comment({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      editedAt: props.editedAt ?? null
    });
  }

  edit(body: string, editedAt = new Date()) {
    return new Comment({
      ...this,
      body,
      editedAt
    });
  }
}
