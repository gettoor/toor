import { generateText, Output } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { DistributionRange } from '../../math/index.js';
import { 
  buildModelCallSettings,
  MetricResult,
  removeNewlines,
} from '../../llm/index.js';
import { DefaultModelProvider } from '../../model-provider/index.js';
import { modelParametersToRPEInfo } from '../rpe-info/index.js';
import { findPromptById, RPEState } from '../rpe-state/index.js';
import { RPEEvaluatorOutput } from '../rpe-evaluator/index.js';
import { 
  RPEAnalyzer,
  RPEAnalyzerInfo,
  RPEAnalyzerInput,
  RPEAnalyzerOutput,
} from './rpe-analyzer-types.js';
import { DEFAULT_RPE_ANALYZER_PROMPT } from './default-rpe-analyzer-prompt.js';
import { 
  DefaultRPEAnalyzerInput,
  DefaultRPEAnalyzerOutputSchema,
} from './default-rpe-analyzer-types.js';

const DEFAULT_FAILED_EXAMPLES_COUNT = 3;

export function defaultRPEAnalyzer(
  input: DefaultRPEAnalyzerInput,
): RPEAnalyzer {
  const { modelName, modelParameters } = input;
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();

  return {
    run: async (
      state: RPEState,
      input: RPEAnalyzerInput,
    ): Promise<RPEAnalyzerOutput> => {
      // build prompt
      const prompt = replacePlaceholders(
        DEFAULT_RPE_ANALYZER_PROMPT,
        {
          prompt: findPromptById(state, input.aggregation.promptRef.promptId).prompt,
          aggregated_score: input.aggregation.aggregatedScore,
          aggregated_metrics: aggregatedMetricsForPrompt(
            input.aggregation.aggregatedMetrics ?? {},
          ),
          score_distribution: scoreDistributionForPrompt(
            input.aggregation.scoreDistribution,
          ),
          passed_explanations: explanationsForPrompt(
            input.aggregation.passedEvaluations,
          ),
          failed_examples: failedExamplesForPrompt(
            input.aggregation.failedEvaluations,
            DEFAULT_FAILED_EXAMPLES_COUNT,
          ),
        },
      );

      // generate text response
      const model = await modelProvider.getModel(modelName);
      const { output, usage } = await generateText({
        model: model.model,
        prompt: prompt.text,
        ...buildModelCallSettings(modelParameters),
        output: Output.object({
          schema: DefaultRPEAnalyzerOutputSchema,
        })
      });

      return {
        promptRef: input.aggregation.promptRef,
        strengths: output.strengths.map(strength => strength.description),
        weaknesses: output.weaknesses.map(weakness => weakness.description),
        recommendations: output.recommendations.map(recommendation => {
          return `${recommendation.goal} (${recommendation.reason})`;
        }),
        failurePatterns: output.failurePatterns.map(failurePattern => {
          return failurePattern.description;
        }),
        usage: {
          modelUsage: [
            {
              modelName: model.name,
              inputTokens: usage.inputTokens,
              outputTokens: usage.outputTokens,
            },
          ],
        },
      };
    },

    getInfo: async (): Promise<RPEAnalyzerInfo> => {
      return {
        name: 'Default Analyzer',
        properties: [
          {
            key: 'model',
            value: modelProvider.getProviderModelName(modelName),
            description: 'Model name used for the analysis.',
          },
          ...modelParametersToRPEInfo(modelParameters),
        ],
      };
    },
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

function failedExamplesForPrompt(
  evaluations: RPEEvaluatorOutput[],
  count: number,
): string {
  return evaluations
    .slice(0, count)
    .map(({ response, datasetEntry, reasoning }, index) => {
      const expectedResponse = datasetEntry.expectedResponse;
      const no = `${index + 1}.`
      const expectedResponseEntry = expectedResponse
        ? `   **Expected response**: ${removeNewlines(expectedResponse)}`
        : '';
      return [
        `${no} **Response from model**: ${removeNewlines(response)}`,
        expectedResponseEntry,
        `   **Explanation from evaluator**: ${removeNewlines(reasoning)}`,
      ]
      .filter(line => line !== '')
      .join('\n');
    })
    .join('\n');
}