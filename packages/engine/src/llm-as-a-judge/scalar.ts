import { generateText, Output } from 'ai';
import { z } from 'zod';

import { LLMUsage } from '../llm/index.js';
import { replacePlaceholders } from '../string/index.js';
import { buildModelCallSettings } from './utils.js';
import { ScoringScalePromptRequiredError } from './scalar-errors.js';
import { ScalarInput, ScalarOutput, ScalarResult } from './scalar-types.js';
import { SCALAR_SCORING_DEFAULT } from './scalar-scoring.js';
import { SCALAR_PROMPT } from './scalar-prompt.js';

/**
 * Scores a response against a prompt using a language model.
 * @param input - The input for the scoring.
 * @returns The output of the scoring.
 */
export async function scalar(input: ScalarInput): Promise<ScalarOutput> {
  const scoringScale = input.scoringScale ?? SCALAR_SCORING_DEFAULT;
  if (!scoringScale.prompt) {
    throw new ScoringScalePromptRequiredError();
  }

  const { text: evalPrompt } = replacePlaceholders(
    input.evalPrompt ?? SCALAR_PROMPT,
    {
      evaluation_prompt: input.prompt,
      response: input.answer,
      scoring_scale: scoringScale.prompt.trim(),
    },
  );

  const response = await generateText({
    model: input.model,
    prompt: evalPrompt,
    ...buildModelCallSettings(input.modelParameters),
    output: Output.object({
      schema: z.object({
        score: z.number().describe('The score for the response'),
        reasoning: z.string().describe('The reasoning for the score'),
        correctness: z.number().describe('The score for correctness'),
        completeness: z.number().describe('The score for completeness'),
        relevance: z.number().describe('The score for relevance'),
      }),
    }),
  });
  const output = response.output;
  const result: ScalarResult = {
    score: output.score,
    correctness: output.correctness,
    completeness: output.completeness,
    relevance: output.relevance,
  };
  const usage: LLMUsage = {
    inputTokens: response.usage.inputTokens,
    outputTokens: response.usage.outputTokens,
  };
  return { result, reasoning: output.reasoning, usage };
}
