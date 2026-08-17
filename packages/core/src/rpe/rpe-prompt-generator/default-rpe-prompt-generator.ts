import { generateText, Output } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { DistributionRange } from '../../math/index.js';
import { MetricResult, buildModelCallSettings } from '../../llm/index.js';
import { DefaultModelProvider } from '../../model-provider/index.js';
import { RPEEvaluatorOutput } from '../rpe-evaluator/rpe-evaluator-types.js';
import { 
  DEFAULT_RPE_PROMPT_GENERATOR_PROMPT,
} from './default-rpe-prompt-generator-prompt.js';
import { 
  RPEPromptGenerator,
  RPEPromptGeneratorInput,
  RPEPromptGeneratorOutput,
} from './rpe-prompt-generator-types.js';
import { 
  DefaultRPEPromptGeneratorInput,
  DefaultRPEPromptGeneratorOutputSchema,
} from './default-rpe-prompt-generator-types.js';

export function defaultRPEPromptGenerator(
  input: DefaultRPEPromptGeneratorInput,
): RPEPromptGenerator {
  const { modelName, modelParameters } = input;
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();

  return async (
    input: RPEPromptGeneratorInput,
  ): Promise<RPEPromptGeneratorOutput> => {
    const prompt = replacePlaceholders(
      DEFAULT_RPE_PROMPT_GENERATOR_PROMPT,
      {
        original_prompt: input.prompt.prompt,
        aggregated_score: input.aggregation.aggregatedScore,
        aggregated_metrics: aggregatedMetricsForPrompt(
          input.aggregation.aggregatedMetrics ?? {},
        ),
        score_distribution: scoreDistributionForPrompt(
          input.aggregation.scoreDistribution,
        ),
        strengths: input.analysis.strengths.join('\n'),
        weaknesses: input.analysis.weaknesses.join('\n'),
        recommendations: input.analysis.recommendations.join('\n'),
        failure_patterns: input.analysis.failurePatterns.join('\n'),
        passed_evaluations: explanationsForPrompt(
          input.aggregation.passedEvaluations,
        ),
        failed_evaluations: explanationsForPrompt(
          input.aggregation.failedEvaluations,
        ),
      },
    );

    const model = await modelProvider.getModel(modelName);
    const { output } = await generateText({
      model,
      prompt: prompt.text,
      ...buildModelCallSettings(modelParameters),
      output: Output.object({
        schema: DefaultRPEPromptGeneratorOutputSchema,
      })
    });

    return { 
      prompt: {
        prompt: output.prompt,
        parentPromptIds: [input.prompt.promptId],
      },
      changes: output.changes.map(change => ({
        description: change.description,
        reasoning: change.reasoning,
      })),
    }
  };
}

function aggregatedMetricsForPrompt(
  metrics: Record<string, MetricResult>,
): string {
  // TODO: implement
  return '';
}

function scoreDistributionForPrompt(
  ranges: DistributionRange[],
): string {
  const sorted = [...ranges].sort((a, b) => a.min - b.min);
  return sorted
    .map(range => {
      return `${range.min}-${range.max}: ${range.count}`;
    })
    .join('\n');
}

function explanationsForPrompt(
  evaluations: RPEEvaluatorOutput[],
): string {
  return evaluations
    .map(evaluation => {
      return `- ${evaluation.reasoning}`;
    })
    .join('\n');
}