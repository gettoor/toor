import { ToorError } from './toor-error.js';

/**
 * Thrown when a resource is not found.
 * @category Errors
 */
export class NotFoundToorError extends ToorError {
  public constructor(errorCode: string, message: string) {
    super(errorCode, message, 404);
  }
}

/**
 * Thrown when a request is invalid.
 * @category Errors
 */
export class BadRequestToorError extends ToorError {
  public constructor(errorCode: string, message: string) {
    super(errorCode, message, 400);
  }
}

/**
 * Thrown when a required API key is missing.
 * @category Errors
 */
export class MissingApiKeyError extends NotFoundToorError {
  public static readonly CODE = 'MissingApiKeyError';

  public constructor(apiKey: string) {
    super(
      MissingApiKeyError.CODE,
      `Missing API key ${ToorError.quote(apiKey)}`,
    );
  }
}

/**
 * Thrown when an internal error occurs.
 * @category Errors
 */
export class InternalToorError extends ToorError {
  public static readonly CODE = 'InternalToorError';

  public constructor(message: string) {
    super(InternalToorError.CODE, message, 500);
  }
}