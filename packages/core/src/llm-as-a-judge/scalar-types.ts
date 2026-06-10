import { LanguageModel } from 'ai';
import { ModelParameters, Output } from './types.js';

/**
 * A scoring scale for the scalar evaluation.
 * @category LLM-as-a-judge
 */
export interface ScalarScoringScale {
  /**
   * The minimum score.
   */
  min: number;

  /**
   * The maximum score.
   */
  max: number;

  /**
   * The prompt to use for the scoring scale.
   * If not provided, the default prompt will be used.
   * @see {@link SCALAR_SCORING_DEFAULT}
   */
  prompt?: string;
}

/**
 * Input for the scalar evaluation.
 * @category LLM-as-a-judge
 */
export interface ScalarInput {
  /**
   * The language model to use for the evaluation.
   */
  model: LanguageModel;

  /**
   * The parameters to use for the language model.
   */
  modelParameters?: ModelParameters;

  /**
   * The prompt to use for the evaluation.
   */
  prompt: string;

  /**
   * The answer to the prompt.
   */
  answer: string;

  /**
   * The scoring scale to use for the evaluation.
   */
  scoringScale?: ScalarScoringScale;

  /**
   * The prompt to use for the evaluation.
   * If not provided, the default prompt will be used.
   * @see {@link SCALAR_PROMPT}
   */
  evalPrompt?: string;
}


/**
 * Result for the scalar evaluation.
 * @category LLM-as-a-judge
 */
export interface ScalarResult {
  /**
   * The score for the response.
   */
  score: number;

  /**
   * The score for correctness.
   */
  correctness: number;

  /**
   * The score for completeness.
   */
  completeness: number;

  /**
   * The score for relevance.
   */
  relevance: number;
}

/**
 * Output for the scalar evaluation.
 * @category LLM-as-a-judge
 */
export interface ScalarOutput extends Output<ScalarResult> {}
