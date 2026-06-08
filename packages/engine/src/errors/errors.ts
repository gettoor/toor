import { ToorError } from './toor-error.js';

export class NotFoundToorError extends ToorError {
  public constructor(errorCode: string, message: string) {
    super(errorCode, message, 404);
  }
}

export class BadRequestToorError extends ToorError {
  public constructor(errorCode: string, message: string) {
    super(errorCode, message, 400);
  }
}

export class MissingApiKeyError extends NotFoundToorError {
  public static readonly CODE = 'MissingApiKeyError';

  public constructor(apiKey: string) {
    super(
      MissingApiKeyError.CODE,
      `Missing API key ${ToorError.quote(apiKey)}`,
    );
  }
}

