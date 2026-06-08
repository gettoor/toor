import { 
  BadRequestToorError,
  NotFoundToorError,
  ToorError,
} from '../errors/index.js';

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

export class InvalidPlaceholderFormatError extends BadRequestToorError {
  public static readonly CODE = 'InvalidPlaceholderFormatError';

  public constructor(format: string) {
    super(
      InvalidPlaceholderFormatError.CODE,
      `Invalid placeholder format: ${ToorError.quote(format)}`,
    );
  }
}

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