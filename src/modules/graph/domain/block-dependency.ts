import { assertNonEmptyText } from "@/src/shared/domain";

export const BLOCK_DEPENDENCY_KINDS = ["finish_to_start"] as const;

export type BlockDependencyKind = (typeof BLOCK_DEPENDENCY_KINDS)[number];

export class BlockDependency {
  readonly id: string;
  readonly projectId: string;
  readonly predecessorBlockId: string;
  readonly successorBlockId: string;
  readonly kind: BlockDependencyKind;
  readonly createdAt: Date;

  private constructor(props: {
    id: string;
    projectId: string;
    predecessorBlockId: string;
    successorBlockId: string;
    kind: BlockDependencyKind;
    createdAt: Date;
  }) {
    this.id = assertNonEmptyText(props.id, "dependencyId");
    this.projectId = assertNonEmptyText(props.projectId, "projectId");
    this.predecessorBlockId = assertNonEmptyText(props.predecessorBlockId, "predecessorBlockId");
    this.successorBlockId = assertNonEmptyText(props.successorBlockId, "successorBlockId");
    this.kind = props.kind;
    this.createdAt = props.createdAt;
  }

  static create(props: {
    id: string;
    projectId: string;
    predecessorBlockId: string;
    successorBlockId: string;
    kind?: BlockDependencyKind;
    createdAt?: Date;
  }) {
    return new BlockDependency({
      ...props,
      kind: props.kind ?? "finish_to_start",
      createdAt: props.createdAt ?? new Date()
    });
  }
}
