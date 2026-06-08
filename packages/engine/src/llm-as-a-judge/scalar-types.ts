import { LanguageModel } from 'ai';
import { ModelParameters, Output } from './types.js';

export interface ScalarScoringScale {
  // The minimum score.
  min: number;

  // The maximum score.
  max: number;

  /**
   * The prompt to use for the scoring scale.
   * If not provided, the default prompt will be used.
   * @see {import('./scalar-scoring.ts').SCALAR_SCORING_DEFAULT}
   */
  prompt?: string;
}

export interface ScalarInput {
  // The language model to use for the evaluation.
  model: LanguageModel;

  // The parameters to use for the language model.
  modelParameters?: ModelParameters;

  // The prompt to use for the evaluation.
  prompt: string;

  // The answer to the prompt.
  answer: string;

  // The scoring scale to use for the evaluation.
  scoringScale?: ScalarScoringScale;

  /**
   * The prompt to use for the evaluation.
   * If not provided, the default prompt will be used.
   * @see {import('./scalar-prompt.ts').SCALAR_PROMPT}
   */
  evalPrompt?: string;
}

export interface ScalarResult {
  // The score for the response.
  score: number;

  // The score for correctness.
  correctness: number;

  // The score for completeness.
  completeness: number;

  // The score for relevance.
  relevance: number;
}

export interface ScalarOutput extends Output<ScalarResult> {}
