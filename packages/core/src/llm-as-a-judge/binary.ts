import { z } from 'zod';

import { llmGenerateStructuredOutput, LLMUsage, buildModelCallSettings } from '../llm/index.js';
import { 
  requirePlaceholders,
  replacePlaceholders,
  rejectUnknownPlaceholders,
} from '../string/index.js';
import { DefaultModelProvider } from '../model-provider/index.js';
import { BinaryInput, BinaryOutput } from './binary-types.js';
import { BINARY_PROMPT } from './binary-prompt.js';

/**
 * Evaluates a response against a prompt using a language model with score
 * either 0 (failed) or 1 (passed).
 * @category LLM-as-a-judge
 * @param input - Input for the evaluation.
 * @returns Output of the evaluation.
 */
export async function binary(input: BinaryInput): Promise<BinaryOutput> {
  if (input.evalPrompt) {
    requirePlaceholders(input.evalPrompt, ['prompt', 'response']);
    rejectUnknownPlaceholders(input.evalPrompt, ['prompt', 'response']);
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

  const response = await llmGenerateStructuredOutput({
    model,
    prompt: evalPrompt,
    ...buildModelCallSettings(input.modelParameters),
    schema: z.object({
      passed: z
        .boolean()
        .describe('Whether the response passed the evaluation'),
      reasoning: z
        .string()
        .describe('The reasoning for the evaluation'),
    }).strict(),
  });

  const { passed, reasoning } = response.output;
  return { 
    result: passed,
    reasoning,
    usage: response.usage,
  };
}