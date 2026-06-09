import { NotFoundToorError, ToorError } from '../errors/index.js';
import { 
  ExperimentEvaluationType,
  ExperimentStructuredOutputFormat,
} from './experimentation-types.js';

/**
 * Thrown when an unknown experiment evaluation type is encountered.
 * @category Experimentation
 */
export class UnknownExperimentEvaluationTypeError extends NotFoundToorError {
  public static readonly CODE = 'UnknownExperimentEvaluationTypeError';

  /**
   * Creates a new UnknownExperimentEvaluationTypeError.
   * @param evalType - The unknown experiment evaluation type.
   */
  public constructor(evalType: ExperimentEvaluationType) {
    super(
      UnknownExperimentEvaluationTypeError.CODE,
      `Unknown experiment evaluation type ${ToorError.quote(evalType)}`,
    );
  }
}

/**
 * Thrown when an unknown experiment structured output format is encountered.
 * @category Experimentation
 */
export class UnknownExperimentStructuredOutputFormatError
  extends NotFoundToorError
{
  public static readonly CODE = 'UnknownExperimentStructuredOutputFormatError';

  /**
   * Creates a new UnknownExperimentStructuredOutputFormatError.
   * @param format - The unknown experiment structured output format.
   */
  public constructor(format: ExperimentStructuredOutputFormat) {
    super(
      UnknownExperimentStructuredOutputFormatError.CODE,
      `Unknown experiment structured output format ${ToorError.quote(format)}`,
    );
  }
}