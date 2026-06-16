import { generateText, Output } from 'ai';
import { z } from 'zod';

import { LLMUsage, MetricResult } from '../llm/index.js';
import { 
  rejectUnknownPlaceholders,
  replacePlaceholders,
  requirePlaceholders,
} from '../string/index.js';
import { DefaultModelProvider } from '../model-provider/index.js';
import { buildModelCallSettings } from './utils.js';
import { ScoringScalePromptRequiredError } from './scalar-errors.js';
import { 
  ScalarInput,
  ScalarMetric,
  ScalarOutput,
  ScalarResult,
} from './scalar-types.js';
import { SCALAR_SCORING_DEFAULT } from './scalar-scoring.js';
import { SCALAR_PROMPT } from './scalar-prompt.js';

/**
 * Scores a response against a prompt using a language model.
 * @category LLM-as-a-judge
 * @param input - The input for the scoring.
 * @returns The output of the scoring.
 */
export async function scalar(input: ScalarInput): Promise<ScalarOutput> {
  const scoringScale = input.scoringScale ?? SCALAR_SCORING_DEFAULT;
  if (!scoringScale.prompt) {
    throw new ScoringScalePromptRequiredError();
  }
  if (input.evalPrompt) {
    requirePlaceholders(input.evalPrompt, [
      'prompt',
      'response',
      'scoring_scale',
    ]);
    rejectUnknownPlaceholders(input.evalPrompt, [
      'prompt',
      'response',
      'scoring_scale',
      'metrics', // optional
    ]);
  }

  // build metrics for prompt
  const metricsForPrompt = (input.metrics ?? [])
    .map(metric => {
      const description = metric.promptDescription
        ? `: ${metric.promptDescription}`
        : '';
      return '   - ' + metric.name + description;
    })
    .join('\n') ?? '';

  // build prompt
  const { text: evalPrompt } = replacePlaceholders(
    input.evalPrompt ?? SCALAR_PROMPT,
    {
      prompt: input.prompt,
      response: input.response,
      scoring_scale: scoringScale.prompt.trim(),
      metrics: metricsForPrompt,
    },
  );

  // resolve model
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();
  const model = await modelProvider.getModel(input.modelName);

  // build metrics schema
  const metricsSchema: Record<
    ScalarMetric['name'],
    z.ZodObject<{
      score: z.ZodNumber;
      reasoning: z.ZodString;
    }>
  > = {};
  for (const metric of input.metrics ?? []) {
    metricsSchema[metric.name] = z.object({
      score: z.number().describe(metric.schemeDescription),
      reasoning: z.string().describe('The reasoning for the metric score'),
    });
  }

  // generate text
  const response = await generateText({
    model,
    prompt: evalPrompt,
    ...buildModelCallSettings(input.modelParameters),
    output: Output.object({
      schema: z.looseObject({
        score: z.number().describe('The score for the response'),
        reasoning: z.string().describe('The reasoning for the score'),
        ...metricsSchema,
      }),
    }),
  });

  // collect metrics
  const metrics: Record<ScalarMetric['name'], MetricResult> = {};
  for (const metric of input.metrics ?? []) {
    metrics[metric.name] = response.output[metric.name] as MetricResult;
  }

  // compile result
  const output = response.output;
  const result: ScalarResult = {
    score: output.score,
    metrics,
  };
  const usage: LLMUsage = {
    inputTokens: response.usage.inputTokens,
    outputTokens: response.usage.outputTokens,
  };
  return { result, reasoning: output.reasoning, usage };
}
