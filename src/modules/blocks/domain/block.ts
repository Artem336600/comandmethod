import {
  assertMaxLength,
  assertOptionalText,
  assertUniqueTextList,
  assertNonEmptyText
} from "@/src/shared/domain";
import { BlockerDetails } from "./blocker-details";
import type { BlockKind } from "./block-kind";
import { BlockPolicy } from "./block-policy";
import type { BlockStatus } from "./block-status";
import { DefinitionOfDone } from "./definition-of-done";

export type BlockProps = {
  id: string;
  projectId: string;
  parentBlockId: string | null;
  title: string;
  summary: string | null;
  expectedResult: string | null;
  definitionOfDone: DefinitionOfDone | null;
  acceptanceCriteria: string[];
  ownerId: string | null;
  status: BlockStatus;
  blocker: BlockerDetails | null;
  kind: BlockKind;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBlockInput = {
  id: string;
  projectId: string;
  parentBlockId?: string | null;
  title: string;
  summary?: string | null;
  expectedResult?: string | null;
  definitionOfDone?: readonly string[] | null;
  acceptanceCriteria?: readonly string[];
  ownerId?: string | null;
  status?: BlockStatus;
  blocker?: { reason: string; source: string; unblockCondition: string } | null;
  kind?: BlockKind;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Block {
  private readonly props: BlockProps;

  private constructor(props: BlockProps) {
    Block.validate(props);
    this.props = props;
  }

  static create(input: CreateBlockInput) {
    const createdAt = input.createdAt ?? new Date();
    const updatedAt = input.updatedAt ?? createdAt;

    return new Block({
      id: assertNonEmptyText(input.id, "blockId"),
      projectId: assertNonEmptyText(input.projectId, "projectId"),
      parentBlockId: normalizeNullableId(input.parentBlockId, "parentBlockId"),
      title: assertMaxLength(assertNonEmptyText(input.title, "blockTitle"), "blockTitle", 180),
      summary: normalizeOptionalLongText(input.summary, "blockSummary", 1000),
      expectedResult: normalizeOptionalLongText(input.expectedResult, "expectedResult", 1000),
      definitionOfDone: input.definitionOfDone ? DefinitionOfDone.create(input.definitionOfDone) : null,
      acceptanceCriteria: normalizeAcceptanceCriteria(input.acceptanceCriteria ?? []),
      ownerId: normalizeNullableId(input.ownerId, "ownerId"),
      status: input.status ?? "draft",
      blocker: input.blocker ? BlockerDetails.create(input.blocker) : null,
      kind: input.kind ?? "deliverable",
      createdAt,
      updatedAt
    });
  }

  get id() {
    return this.props.id;
  }

  get projectId() {
    return this.props.projectId;
  }

  get parentBlockId() {
    return this.props.parentBlockId;
  }

  get title() {
    return this.props.title;
  }

  get summary() {
    return this.props.summary;
  }

  get expectedResult() {
    return this.props.expectedResult;
  }

  get definitionOfDone() {
    return this.props.definitionOfDone;
  }

  get acceptanceCriteria() {
    return [...this.props.acceptanceCriteria];
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get status() {
    return this.props.status;
  }

  get blocker() {
    return this.props.blocker;
  }

  get kind() {
    return this.props.kind;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  assignOwner(ownerId: string, updatedAt = new Date()) {
    return new Block({
      ...this.props,
      ownerId: assertNonEmptyText(ownerId, "ownerId"),
      updatedAt
    });
  }

  defineExecution(input: {
    expectedResult: string;
    definitionOfDone: readonly string[];
    acceptanceCriteria?: readonly string[];
    updatedAt?: Date;
  }) {
    return new Block({
      ...this.props,
      expectedResult: normalizeOptionalLongText(input.expectedResult, "expectedResult", 1000),
      definitionOfDone: DefinitionOfDone.create(input.definitionOfDone),
      acceptanceCriteria: normalizeAcceptanceCriteria(input.acceptanceCriteria ?? this.props.acceptanceCriteria),
      updatedAt: input.updatedAt ?? new Date()
    });
  }

  reframeStatus(
    status: BlockStatus,
    blocker: { reason: string; source: string; unblockCondition: string } | null,
    updatedAt = new Date()
  ) {
    return new Block({
      ...this.props,
      status,
      blocker: blocker ? BlockerDetails.create(blocker) : null,
      updatedAt
    });
  }

  toSnapshot(): BlockProps {
    return {
      ...this.props,
      acceptanceCriteria: [...this.props.acceptanceCriteria]
    };
  }

  private static validate(props: BlockProps) {
    BlockPolicy.assertLifecycleState({
      blockId: props.id,
      parentBlockId: props.parentBlockId,
      title: props.title,
      status: props.status,
      ownerId: props.ownerId,
      expectedResult: props.expectedResult,
      definitionOfDone: props.definitionOfDone,
      blocker: props.blocker
    });
  }
}

function normalizeNullableId(value: string | null | undefined, fieldName: string) {
  return value === undefined ? null : assertOptionalText(value, fieldName);
}

function normalizeOptionalLongText(value: string | null | undefined, fieldName: string, maxLength: number) {
  const normalized = assertOptionalText(value, fieldName);
  return normalized ? assertMaxLength(normalized, fieldName, maxLength) : null;
}

function normalizeAcceptanceCriteria(values: readonly string[]) {
  if (values.length === 0) {
    return [];
  }

  const normalized = values.map((value, index) =>
    assertMaxLength(assertNonEmptyText(value, `acceptanceCriteria[${index}]`), "acceptanceCriterion", 280)
  );

  return assertUniqueTextList(normalized, "acceptanceCriteria");
}
