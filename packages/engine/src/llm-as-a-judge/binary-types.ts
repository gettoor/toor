import { LanguageModel } from 'ai';
import { ModelParameters, Output } from './types.js';

/**
 * Input for the binary evaluation.
 * @category LLM-as-a-judge
 */
export interface BinaryInput {
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