import { LLMUsage } from '../../llm/index.js';
import { RPEProperties } from '../rpe-info/index.js';
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
 * Info of the RPE prompt selector.
 * @category Reflective Prompt Evolution
 */
export interface RPEPromptSelectorInfo {
  /**
   * Name of the prompt selector.
   */
  name: string;

  /**
   * Properties of the prompt selector.
   */
  properties?: RPEProperties;
}

/**
 * Function to select the best prompts from the candidates.
 * @category Reflective Prompt Evolution
 */
export interface RPEPromptSelector {
  /**
   * Select the best prompts from the candidates.
   * @param state - State of the RPE process.
   * @param input - Input for the prompt selector.
   * @returns Prompt selector output.
   */
  run(
    state: RPEState,
    input: RPEPromptSelectorInput,
  ): Promise<RPEPromptSelectorOutput>;

  /**
   * Get the info of the prompt selector.
   * @returns Info of the prompt selector.
   */
  getInfo(): Promise<RPEPromptSelectorInfo>;
}