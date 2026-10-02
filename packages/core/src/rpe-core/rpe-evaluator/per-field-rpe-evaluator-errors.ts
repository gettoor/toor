import { BadRequestToorError, ToorError } from '../../errors/index.js';

export class NoPerFieldRPEEvaluatorError extends BadRequestToorError {
  public static readonly CODE = 'NoPerFieldRPEEvaluatorError';

  public constructor(field: string) {
    super(
      NoPerFieldRPEEvaluatorError.CODE,
      `No evaluator found for field: ${ToorError.quote(field)}`,
    );
  }
}