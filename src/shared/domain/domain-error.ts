export type DomainErrorDetails = Record<string, unknown>;

export class DomainError extends Error {
  readonly code: string;
  readonly details?: DomainErrorDetails;

  constructor(code: string, message: string, details?: DomainErrorDetails) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.details = details;
  }
}

export class DomainValidationError extends DomainError {
  constructor(message: string, details?: DomainErrorDetails) {
    super("domain_validation", message, details);
    this.name = "DomainValidationError";
  }
}
