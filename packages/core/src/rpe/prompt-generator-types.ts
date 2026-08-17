import { RPEPrompt } from './rpe-prompt/index.js';
import { 
  RPEPromptGeneratorChange,
} from './rpe-prompt-generator/index.js';

/**
 * Output for the RPE prompt generator.
 * @category Reflective Prompt Evolution
 */
export interface PromptGeneratorCandidate {
  /**
   * New prompt.
   */
  prompt: RPEPrompt;

  /**
   * Changes made to the prompt.
   */
  changes: RPEPromptGeneratorChange[];
}

export interface PromptGeneratorOutput {
  /**
   * New prompt candidates.
   */
  candidates: PromptGeneratorCandidate[];
}