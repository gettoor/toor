import { createHash } from 'crypto';
import { RPEPrompt } from '../index.js';

/**
 * Creates a new RPE prompt.
 * @category Reflective Prompt Evolution
 * @param prompt - Prompt to create.
 * @returns Created RPE prompt.
 */
export function createRPEPrompt(
  prompt: string,
  options: {
    parents?: RPEPrompt[];
  } = {},
): RPEPrompt {
  return {
    prompt,
    promptHash: hash(prompt),
    parents: options.parents,
  }
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}