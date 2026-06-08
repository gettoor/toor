import { ToorError, NotFoundToorError } from '../errors/index.js';

export class ModelNotFoundError extends NotFoundToorError {
  public static readonly CODE = 'ModelNotFoundError';

  public constructor(model: string) {
    super(
      ModelNotFoundError.CODE,
      `Unknown model ${ToorError.quote(model)}`,
    );
  }
}