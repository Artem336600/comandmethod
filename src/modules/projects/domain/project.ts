import { DomainValidationError, assertMaxLength, assertNonEmptyText, assertOptionalText } from "@/src/shared/domain";
import { ProjectPolicy } from "./project-policy";
import { ProjectSlug } from "./project-slug";
import type { ProjectStatus } from "./project-status";

export type ProjectProps = {
  id: string;
  name: string;
  slug: ProjectSlug;
  description: string | null;
  status: ProjectStatus;
  startBlockId: string | null;
  finishBlockId: string | null;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
};

export type CreateProjectInput = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status?: ProjectStatus;
  startBlockId?: string | null;
  finishBlockId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  archivedAt?: Date | null;
};

export class Project {
  private readonly props: ProjectProps;

  private constructor(props: ProjectProps) {
    Project.validate(props);
    this.props = props;
  }

  static create(input: CreateProjectInput) {
    const createdAt = input.createdAt ?? new Date();
    const updatedAt = input.updatedAt ?? createdAt;
    const status = input.status ?? "draft";

    return new Project({
      id: assertNonEmptyText(input.id, "projectId"),
      name: assertMaxLength(assertNonEmptyText(input.name, "projectName"), "projectName", 160),
      slug: ProjectSlug.create(input.slug),
      description: normalizeDescription(input.description),
      status,
      startBlockId: normalizeNullableId(input.startBlockId, "startBlockId"),
      finishBlockId: normalizeNullableId(input.finishBlockId, "finishBlockId"),
      createdAt,
      updatedAt,
      archivedAt: input.archivedAt ?? null
    });
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
  }

  get description() {
    return this.props.description;
  }

  get status() {
    return this.props.status;
  }

  get startBlockId() {
    return this.props.startBlockId;
  }

  get finishBlockId() {
    return this.props.finishBlockId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get archivedAt() {
    return this.props.archivedAt;
  }

  rename(name: string, updatedAt = new Date()) {
    return new Project({
      ...this.props,
      name: assertMaxLength(assertNonEmptyText(name, "projectName"), "projectName", 160),
      updatedAt
    });
  }

  updateDescription(description: string | null, updatedAt = new Date()) {
    return new Project({
      ...this.props,
      description: normalizeDescription(description),
      updatedAt
    });
  }

  activate(updatedAt = new Date()) {
    return new Project({
      ...this.props,
      status: "active",
      updatedAt,
      archivedAt: null
    });
  }

  archive(archivedAt = new Date()) {
    return new Project({
      ...this.props,
      status: "archived",
      updatedAt: archivedAt,
      archivedAt
    });
  }

  setAnchorBlocks(startBlockId: string | null, finishBlockId: string | null, updatedAt = new Date()) {
    return new Project({
      ...this.props,
      startBlockId: normalizeNullableId(startBlockId, "startBlockId"),
      finishBlockId: normalizeNullableId(finishBlockId, "finishBlockId"),
      updatedAt
    });
  }

  toSnapshot(): ProjectProps {
    return {
      ...this.props
    };
  }

  private static validate(props: ProjectProps) {
    ProjectPolicy.assertDistinctAnchorBlocks(props.startBlockId, props.finishBlockId);

    if (props.status === "archived" && !props.archivedAt) {
      throw new DomainValidationError("Archived projects must include an archivedAt timestamp.", {
        projectId: props.id
      });
    }

    if (props.status !== "archived" && props.archivedAt) {
      throw new DomainValidationError("Only archived projects can include archivedAt.", {
        projectId: props.id
      });
    }
  }
}

function normalizeDescription(value: string | null | undefined) {
  const normalized = assertOptionalText(value, "projectDescription");
  return normalized ? assertMaxLength(normalized, "projectDescription", 2000) : null;
}

function normalizeNullableId(value: string | null | undefined, fieldName: string) {
  return value === undefined ? null : assertOptionalText(value, fieldName);
}
