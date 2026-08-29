import { LLMUsage } from '../../llm/index.js';
import { RPEPromptRef } from '../rpe-prompt/index.js';
import { RPEState } from '../rpe-state/index.js';

/**
 * Input for the RPE prompt selector.
 * @category Reflective Prompt Evolution
 */
export interface RPEPromptSelectorInput {}

/**
 * Output for the RPE prompt selector.
 * @category Reflective Prompt Evolution
 */
export interface RPEPromptSelectorOutput {
  /**
   * References to the selected prompts.
   */
  promptRefs: RPEPromptRef[];

  /**
   * Usage of the model.
   */
  usage?: LLMUsage;
}

/**
 * Function to select the best prompts from the candidates.
 * @category Reflective Prompt Evolution
 */
export type RPEPromptSelector = (
  state: RPEState,
  input: RPEPromptSelectorInput,
) => Promise<RPEPromptSelectorOutput>;