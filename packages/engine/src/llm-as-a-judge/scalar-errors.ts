import { BadRequestToorError } from '../errors/index.js';

/**
 * Error thrown when a scoring scale prompt is required.
 * @category LLM-as-a-judge
 */
export class ScoringScalePromptRequiredError extends BadRequestToorError {
  public static readonly CODE = 'ScoringScalePromptRequiredError';

  public constructor() {
    super(
      ScoringScalePromptRequiredError.CODE,
      'Scoring scale prompt is required',
    );
  }
}