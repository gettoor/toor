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
  parentPromptIds?: string[];

  /**
   * Prompt to evaluate.
   */
  prompt: string;

  /**
   * Unique identifier of the prompt.
   */
  promptId: string;
}