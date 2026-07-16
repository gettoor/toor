import { ModelParameters } from '../../llm/index.js';
import { ModelProvider } from '../../model-provider/index.js';

/**
 * Input for the LLM-as-a-judge RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface JudgeRPEEvaluatorInput {
  /**
   * Model provider to use for the evaluator.
   * If not provided, the default model provider will be used.
   */
  modelProvider?: ModelProvider;

  /**
   * Model name to use for the executor.
   */
  modelName: string;

  /**
   * Model parameters to use for the executor.
   */
  modelParameters?: ModelParameters;
}