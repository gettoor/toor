import { generateText, Output } from 'ai';
import { z } from 'zod';

import { LLMUsage } from '../llm/index.js';
import { requirePlaceholders, replacePlaceholders } from '../string/index.js';
import { DefaultModelProvider } from '../model-provider/index.js';
import { buildModelCallSettings } from './utils.js';
import { BinaryInput, BinaryOutput } from './binary-types.js';
import { BINARY_PROMPT } from './binary-prompt.js';

/**
 * Evaluates a response against a prompt using a language model with score
 * either 0 (failed) or 1 (passed).
 * @category LLM-as-a-judge
 * @param input - The input for the evaluation.
 * @returns The output of the evaluation.
 */
export async function binary(input: BinaryInput): Promise<BinaryOutput> {
  if (input.evalPrompt) {
    requirePlaceholders(input.evalPrompt, ['prompt', 'response']);
  }

  const { text: evalPrompt } = replacePlaceholders(
    input.evalPrompt ?? BINARY_PROMPT,
    {
      prompt: input.prompt,
      response: input.response,
    },
  );

  const modelProvider = input.modelProvider ?? new DefaultModelProvider();
  const model = await modelProvider.getModel(input.modelName);

  const response = await generateText({
    model,
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