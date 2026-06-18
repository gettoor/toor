import { MetricResult, ModelParameters } from '../llm/index.js';
import { ModelProvider } from '../model-provider/index.js';
import { Output } from './types.js';

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
   * @see {@link SCALAR_SCORING_DEFAULT}
   * @see {@link SCALAR_SCORING_1_3}
   * @see {@link SCALAR_SCORING_1_5}
   * @see {@link SCALAR_SCORING_1_10}
   * @example
   * ```ts
   * const scoringScale: ScalarScoringScale = {
   *   min: 0,
   *   max: 1,
   *   prompt: `
   *     0 = Incorrect or irrelevant
   *     1 = Correct
   *   `,
   */
  prompt: string;
}

/**
 * A metric for the scalar evaluation.
 * @category LLM-as-a-judge
 */
export interface ScalarMetric {
  /**
   * The name of the metric.
   */
  name: string;

  /**
   * The description of the scheme in the structured output.
   */
  schemeDescription: string;

  /**
   * The description of the prompt. If not provided, then just name is passed.
   */
  promptDescription?: string;
}

/**
 * Input for the scalar evaluation.
 * @category LLM-as-a-judge
 */
export interface ScalarInput {
  /**
   * The name of the model to use for the evaluation.
   */
  modelName: string;

  /**
   * The model provider to use for the evaluation.
   * Uses the default model provider {@link DefaultModelProvider} if not set.
   */
  modelProvider?: ModelProvider;

  /**
   * The parameters to use for the language model.
   */
  modelParameters?: ModelParameters;

  /**
   * The prompt to use for the evaluation.
   */
  prompt: string;

  /**
   * The response to the prompt.
   */
  response: string;

  /**
   * The scoring scale to use for the evaluation.
   * If not provided, the default scoring scale will be used.
   * @see {@link SCALAR_SCORING_DEFAULT}
   */
  scoringScale?: ScalarScoringScale;

  /**
   * The metrics to use for the evaluation.
   */
  metrics?: ScalarMetric[];

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
   * The metrics for the response where key is the metric name
   * and value is the score.
   */
  metrics: Record<ScalarMetric['name'], MetricResult>;
}

/**
 * Output for the scalar evaluation.
 * @category LLM-as-a-judge
 */
export interface ScalarOutput extends Output<ScalarResult> {}
