import { NotFoundToorError, ToorError } from '../errors/index.js';
import { 
  ExperimentEvaluationType,
  ExperimentStructuredOutputFormat,
} from './experimentation-types.js';

export class UnknownExperimentEvaluationTypeError extends NotFoundToorError {
  public static readonly CODE = 'UnknownExperimentEvaluationTypeError';

  public constructor(evalType: ExperimentEvaluationType) {
    super(
      UnknownExperimentEvaluationTypeError.CODE,
      `Unknown experiment evaluation type ${ToorError.quote(evalType)}`,
    );
  }
}

export class UnknownExperimentStructuredOutputFormatError
  extends NotFoundToorError
{
  public static readonly CODE = 'UnknownExperimentStructuredOutputFormatError';

  public constructor(format: ExperimentStructuredOutputFormat) {
    super(
      UnknownExperimentStructuredOutputFormatError.CODE,
      `Unknown experiment structured output format ${ToorError.quote(format)}`,
    );
  }
}