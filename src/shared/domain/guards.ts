import { DomainValidationError } from "./domain-error";

export function assertNonEmptyText(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new DomainValidationError(`${fieldName} is required.`, { fieldName });
  }

  return normalized;
}

export function assertOptionalText(value: string | null | undefined, fieldName: string): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
}

export function assertMaxLength(value: string, fieldName: string, maxLength: number): string {
  if (value.length > maxLength) {
    throw new DomainValidationError(`${fieldName} must be ${maxLength} characters or less.`, {
      fieldName,
      maxLength
    });
  }

  return value;
}

export function assertNonEmptyStringList(values: readonly string[], fieldName: string): string[] {
  if (values.length === 0) {
    throw new DomainValidationError(`${fieldName} requires at least one item.`, { fieldName });
  }

  return values.map((value, index) =>
    assertNonEmptyText(value, `${fieldName}[${index}]`)
  );
}

export function assertUniqueTextList(values: readonly string[], fieldName: string): string[] {
  const normalized = values.map((value) => value.trim());
  const uniqueValues = new Set(normalized);

  if (uniqueValues.size !== normalized.length) {
    throw new DomainValidationError(`${fieldName} must not contain duplicates.`, { fieldName });
  }

  return normalized;
}
