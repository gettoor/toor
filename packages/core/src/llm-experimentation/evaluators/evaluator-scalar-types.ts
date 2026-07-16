import { ModelProvider } from '../../model-provider/index.js';
import { ModelParameters } from '../../llm/index.js';
import { ScalarScoringScale } from '../../llm-as-a-judge/index.js';

/**
 * Input for the scalar evaluator.
 * @category Experimentation
 */
export interface EvaluatorScalarInput {
  /**
   * The scoring scale to use for the evaluation.
   */
  scoringScale: ScalarScoringScale;

  /**
   * Model name to use for the evaluation.
   */
  modelName: string;

  /**
   * Model provider to use for the evaluation.
   */
  modelProvider?: ModelProvider;

  /**
   * Model parameters to use for the evaluation.
   */
  modelParameters?: ModelParameters;

  /**
   * The prompt to use for the evaluation.
   */
  evalPrompt?: string;
}