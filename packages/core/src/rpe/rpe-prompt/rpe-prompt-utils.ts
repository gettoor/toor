import { RPEPrompt, RPEPromptRef } from './rpe-prompt-types.js';

/**
 * Creates a reference to a prompt.
 * @category Reflective Prompt Evolution
 * @param prompt - Prompt to create a reference for.
 * @returns Reference to the prompt.
 */
export function promptRefFromPrompt(prompt: RPEPrompt): RPEPromptRef {
  return {
    promptId: prompt.promptId,
  }
}