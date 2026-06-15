import { ModelParameters, Output } from './types.js';
import { ModelProvider } from '../model-provider/index.js';

/**
 * Input for the binary evaluation.
 * @category LLM-as-a-judge
 */
export interface BinaryInput {
  /**
   * The language model to use for the evaluation.
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
   * The prompt to use for the evaluation.
   * If not provided, the default prompt will be used.
   * @see {@link BINARY_PROMPT}
   */
  evalPrompt?: string;
}

/**
 * Output for the binary evaluation.
 * @category LLM-as-a-judge
 */
export interface BinaryOutput extends Output<boolean> {}