import { ModelParameters } from '../../llm/index.js';
import { ModelProvider } from '../../model-provider/index.js';

/**
 * Input for the LLM RPE executor.
 * @category Reflective Prompt Evolution
 */
export interface LLMRPEExecutorInput {
  /**
   * Model name to use for the executor.
   */
  modelName: string;

  /**
   * Model provider to use for the executor.
   */
  modelProvider?: ModelProvider;

  /**
   * Model parameters to use for the executor.
   */
  modelParameters?: ModelParameters;
}