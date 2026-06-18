import { ModelParameters } from '../../llm/index.js';
import { ModelProvider } from '../../model-provider/index.js';

/**
 * Input for the binary evaluator.
 * @category Experimentation
 */
export interface EvaluatorBinaryInput {
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