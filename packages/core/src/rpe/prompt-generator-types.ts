import { RPEPromptGeneratorOutput } from './rpe-prompt-generator/index.js';

export interface PromptGeneratorOutput {
  /**
   * New prompt candidates.
   */
  candidates: RPEPromptGeneratorOutput[];
}