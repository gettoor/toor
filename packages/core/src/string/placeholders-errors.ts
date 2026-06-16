import { 
  BadRequestToorError,
  NotFoundToorError,
  ToorError,
} from '../errors/index.js';

/**
 * Error thrown when an invalid format is provided for an object placeholder.
 * @category Utils
 */
export class InvalidFormatForObjectError extends BadRequestToorError {
  public static readonly CODE = 'InvalidFormatForObjectError';

  public constructor(fullKey: string, format: string) {
    super(
      InvalidFormatForObjectError.CODE,
      `Invalid format ${ToorError.quote(format)} for object at placeholder ` +
      `${ToorError.quote(fullKey)}`,
    );
  }
}

/**
 * Error thrown when an invalid format is provided for a placeholder.
 * @category Utils
 */
export class InvalidPlaceholderFormatError extends BadRequestToorError {
  public static readonly CODE = 'InvalidPlaceholderFormatError';

  public constructor(format: string) {
    super(
      InvalidPlaceholderFormatError.CODE,
      `Invalid placeholder format: ${ToorError.quote(format)}`,
    );
  }
}

/**
 * Error thrown when no value is provided for a placeholder.
 * @category Utils
 */
export class NoValueForPlaceholderError extends NotFoundToorError {
  public static readonly CODE = 'NoValueForPlaceholderError';

  public constructor(private readonly placeholders: string[]) {
    super(
      NoValueForPlaceholderError.CODE,
      `No value provided for placeholders ` +
      `${ToorError.quote(placeholders.join(', '))}`,
    );
  }

  public getPlaceholders(): string[] {
    return [...this.placeholders];
  }
}

/**
 * Error thrown when a placeholder is missing.
 * @category Utils
 */
export class MissingPlaceholderError extends NotFoundToorError {
  public static readonly CODE = 'MissingPlaceholderError';

  public constructor(placeholder: string) {
    super(
      MissingPlaceholderError.CODE,
      `Placeholder ${ToorError.quote(placeholder)} is missing`,
    );
  }
}

/**
 * Error thrown when unknown placeholders are present in a string.
 * @category Utils
 */
export class UnknownPlaceholdersError extends BadRequestToorError {
  public static readonly CODE = 'UnknownPlaceholdersError';

  public constructor(placeholders: string[]) {
    super(
      UnknownPlaceholdersError.CODE,
      `Unknown placeholders: ${ToorError.quote(placeholders.join(', '))}`,
    );
  }
}