/**
 * A prompt representation.
 * @category Reflective Prompt Evolution
 */
export interface RPEPrompt {
  /**
   * Parents of the prompt. Used to create a tree of prompts.
   * There can be multiple parents when a new prompt is created from
   * multiple parents. Typically, there is only one parent.
   */
  parents?: RPEPrompt[];

  /**
   * Prompt to evaluate.
   */
  prompt: string;

  /**
   * Hash of the prompt.
   */
  promptHash: string;
}