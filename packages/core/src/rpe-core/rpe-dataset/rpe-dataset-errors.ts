import {
  ToorError,
  BadRequestToorError,
} from '../../errors/index.js';

/**
 * Error thrown when a duplicate dataset entry is found.
 * @category Reflective Prompt Evolution
 */
export class DuplicateDatasetEntryError extends BadRequestToorError {
  public static readonly CODE = 'DuplicateDatasetEntryError';

  public constructor(public readonly datasetEntryId: string) {
    super(
      DuplicateDatasetEntryError.CODE,
      `Duplicate dataset entry: ${ToorError.quote(datasetEntryId)}`,
    );
  }
}

/**
 * Error thrown when the expected response is not a valid type.
 * @category Reflective Prompt Evolution
 */
export class InvalidRPEExpectedResponseTypeError extends BadRequestToorError {
  public static readonly CODE = 'InvalidRPEExpectedResponseTypeError';

  public constructor(actualType: string, expectedType: string) {
    super(
      InvalidRPEExpectedResponseTypeError.CODE,
      `Invalid expected response type, ` +
      `expected ${ ToorError.quote(expectedType) } ` +
      `but got ${ToorError.quote(actualType)}`,
    );
  }
}