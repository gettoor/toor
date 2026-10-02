import { ToorError, BadRequestToorError } from '../../errors/index.js';

/**
 * Error thrown when the RPE response is not a valid type.
 * @category Reflective Prompt Evolution
 */
export class InvalidRPEResponseTypeError extends BadRequestToorError {
  public static readonly CODE = 'InvalidRPEResponseTypeError';

  public constructor(actualType: string, expectedType: string) {
    super(
      InvalidRPEResponseTypeError.CODE,
      `Invalid RPE response type, ` +
      `expected ${ ToorError.quote(expectedType) } ` +
      `but got ${ToorError.quote(actualType)}`,
    );
  }
}