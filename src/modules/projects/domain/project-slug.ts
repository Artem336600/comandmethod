import { DomainValidationError, assertNonEmptyText } from "@/src/shared/domain";

const PROJECT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ProjectSlug {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    const normalized = assertNonEmptyText(value, "projectSlug").toLowerCase();

    if (!PROJECT_SLUG_PATTERN.test(normalized)) {
      throw new DomainValidationError(
        "Project slug must use lowercase letters, numbers, and hyphens only.",
        { value: normalized }
      );
    }

    return new ProjectSlug(normalized);
  }

  equals(other: ProjectSlug) {
    return this.value === other.value;
  }
}
