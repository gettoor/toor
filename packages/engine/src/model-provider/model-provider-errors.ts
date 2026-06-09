import { ToorError, NotFoundToorError } from '../errors/index.js';

/**
 * Error thrown when a model is not found.
 * @category Model Provider
 */
export class ModelNotFoundError extends NotFoundToorError {
  public static readonly CODE = 'ModelNotFoundError';

  public constructor(model: string) {
    super(
      ModelNotFoundError.CODE,
      `Unknown model ${ToorError.quote(model)}`,
    );
  }
}