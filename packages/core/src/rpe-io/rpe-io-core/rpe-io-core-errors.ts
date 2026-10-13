import { BadRequestToorError, ToorError } from '../../errors/index.js';

export class UnknownRPEIOFormatError extends BadRequestToorError {
  public static readonly CODE = 'UnknownRPEIOFormatError';

  public constructor(format: string) {
    super(
      UnknownRPEIOFormatError.CODE,
      `Unknown RPE IO format ${ToorError.quote(format)}`,
    );
  }
}