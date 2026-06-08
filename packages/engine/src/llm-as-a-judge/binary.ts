import { generateText, Output } from 'ai';
import { z } from 'zod';

import { LLMUsage } from '../llm/index.js';
import { replacePlaceholders } from '../string/index.js';
import { buildModelCallSettings } from './utils.js';
import { BinaryInput, BinaryOutput } from './binary-types.js';
import { BINARY_PROMPT } from './binary-prompt.js';

/**
 * Evaluates a response against a prompt using a language model with score
 * either 0 or 1 (passed or failed).
 * @param input - The input for the evaluation.
 * @returns The output of the evaluation.
 */
export async function binary(input: BinaryInput): Promise<BinaryOutput> {
  const { text: evalPrompt } = replacePlaceholders(
    input.evalPrompt ?? BINARY_PROMPT,
    {
      evaluation_prompt: input.prompt,
      response: input.answer,
    },
  );

  const response = await generateText({
    model: input.model,
    prompt: evalPrompt,
    ...buildModelCallSettings(input.modelParameters),
    output: Output.object({
      schema: z.object({
        passed: z
          .boolean()
          .describe('Whether the response passed the evaluation'),
        reasoning: z
          .string()
          .describe('The reasoning for the evaluation'),
      }),
    }),
  });
  const { passed, reasoning } = response.output;
  const usage: LLMUsage = {
    inputTokens: response.usage.inputTokens,
    outputTokens: response.usage.outputTokens,
  };
  return { result: passed, reasoning, usage };
}
