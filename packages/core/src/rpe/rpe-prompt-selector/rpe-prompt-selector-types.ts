import { RPEPrompt } from '../rpe-prompt/index.js';
import { RPEState } from '../rpe-state/index.js';

/**
 * Input for the RPE prompt selector.
 * @category Reflective Prompt Evolution
 */
export interface RPEPromptSelectorInput {
  /**
   * The current state of the RPE.
   */
  state: RPEState;
}

/**
 * Output for the RPE prompt selector.
 * @category Reflective Prompt Evolution
 */
export interface RPEPromptSelectorOutput {
  /**
   * The selected prompts.
   */
  prompts: RPEPrompt[];
}

/**
 * Function to select the best prompts from the candidates.
 * @category Reflective Prompt Evolution
 */
export type RPEPromptSelector = (
  input: RPEPromptSelectorInput,
) => Promise<RPEPromptSelectorOutput>;