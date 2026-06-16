import { NotFoundToorError, ToorError } from '../errors/index.js';
import { 
  ExperimentStructuredOutputFormat,
} from './experimentation-types.js';

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