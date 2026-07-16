/**
 * A prompt representation.
 * @category Reflective Prompt Evolution
 */
export interface RPEPrompt {
  /**
   * The parents of the prompt. Used to create a tree of prompts.
   * There can be multiple parents when a new prompt is created from
   * multiple parents. Typically, there is only one parent.
   */
  parents?: RPEPrompt[];

  /**
   * The prompt to evaluate.
   */
  prompt: string;
}