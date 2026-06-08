import { LanguageModel } from 'ai';
import { ModelParameters, Output } from './types.js';

export interface BinaryInput {
  // The language model to use for the evaluation.
  model: LanguageModel;

  // The parameters to use for the language model.
  modelParameters?: ModelParameters;

  // The prompt to use for the evaluation.
  prompt: string;

  // The answer to the prompt.
  answer: string;

  /**
   * The prompt to use for the evaluation.
   * If not provided, the default prompt will be used.
   * @see {import('./binary-prompt.ts').BINARY_PROMPT}
   */
  evalPrompt?: string;
}

export interface BinaryOutput extends Output<boolean> {}