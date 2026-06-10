import { ToorError } from '@gettoor/core';

export class FatalError extends ToorError {
  public static readonly CODE = 'FatalError';

  public constructor(message: string) {
    super(FatalError.CODE, message, 500);
  }
}