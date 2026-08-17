import { RPEPrompt } from '../rpe-prompt/index.js';
import { PromptNotFoundError } from './rpe-state-errors.js';
import { RPEState } from './rpe-state-types.js';

/**
 * Finds a prompt by its ID.
 * @category Reflective Prompt Evolution
 * @param state - State of the RPE process.
 * @param promptId - Identifier of the prompt to find.
 * @returns The prompt.
 */
export function findPromptById(state: RPEState, promptId: string): RPEPrompt {
  const prompt = state.prompts.find(prompt => prompt.promptId === promptId);
  if (!prompt) {
    throw new PromptNotFoundError(promptId);
  }
  return prompt;
}