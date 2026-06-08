import { BadRequestToorError } from '../errors/index.js';

export class ScoringScalePromptRequiredError extends BadRequestToorError {
  public static readonly CODE = 'ScoringScalePromptRequiredError';

  public constructor() {
    super(
      ScoringScalePromptRequiredError.CODE,
      'Scoring scale prompt is required',
    );
  }
}