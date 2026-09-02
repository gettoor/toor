import { generateText, Output } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { DistributionRange } from '../../math/index.js';
import { 
  buildModelCallSettings,
  MetricResult,
  removeNewlines,
} from '../../llm/index.js';
import { DefaultModelProvider } from '../../model-provider/index.js';
import { responseToString } from '../rpe-core/index.js';
import { modelParametersToRPEInfo } from '../rpe-info/index.js';
import { requireSinglePromptCandidateModule } from '../rpe-candidate/index.js';
import { findCandidateById, RPEState } from '../rpe-state/index.js';
import { RPEEvaluatorOutput } from '../rpe-evaluator/index.js';
import { 
  RPEAnalyzer,
  RPEAnalyzerInfo,
  RPEAnalyzerInput,
  RPEAnalyzerOutput,
} from './rpe-analyzer-types.js';
import {
  SINGLE_PROMPT_RPE_ANALYZER_PROMPT,
} from './single-prompt-rpe-analyzer-prompt.js';
import { 
  SinglePromptRPEAnalyzerInput,
  SinglePromptRPEAnalyzerOutputSchema,
} from './single-prompt-rpe-analyzer-types.js';

const DEFAULT_PASSED_EXPLANATIONS_COUNT = 3;
const DEFAULT_FAILED_EXAMPLES_COUNT = 3;

/**
 * Creates a single-prompt RPE analyzer. Requires a single-prompt candidate.
 * @category Reflective Prompt Evolution
 * @param input - Input for the single-prompt RPE analyzer.
 * @returns Single-prompt RPE analyzer.
 */
export function singlePromptRPEAnalyzer(
  input: SinglePromptRPEAnalyzerInput,
): RPEAnalyzer {
  const { 
    modelName,
    modelParameters,
    passedEvaluationsCount,
    failedEvaluationsCount,
  } = input;
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();

  return {
    run: async (
      state: RPEState,
      input: RPEAnalyzerInput,
    ): Promise<RPEAnalyzerOutput> => {
      // build prompt
      const candidate = findCandidateById(
        state, input.aggregation.candidateRef.candidateId,
      );
      const prompt = replacePlaceholders(
        SINGLE_PROMPT_RPE_ANALYZER_PROMPT,
        {
          prompt: requireSinglePromptCandidateModule(candidate.modules),
          aggregated_score: input.aggregation.aggregatedScore,
          aggregated_metrics: aggregatedMetricsForPrompt(
            input.aggregation.aggregatedMetrics ?? {},
          ),
          score_distribution: scoreDistributionForPrompt(
            input.aggregation.scoreDistribution,
          ),
          passed_explanations: explanationsForPrompt(
            input.aggregation.passedEvaluations,
            passedEvaluationsCount ?? DEFAULT_PASSED_EXPLANATIONS_COUNT,
          ),
          failed_examples: failedExamplesForPrompt(
            input.aggregation.failedEvaluations,
            failedEvaluationsCount ?? DEFAULT_FAILED_EXAMPLES_COUNT,
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
          schema: SinglePromptRPEAnalyzerOutputSchema,
        })
      });

      return {
        candidateRef: input.aggregation.candidateRef,
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
        name: 'Single-prompt Analyzer',
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
  count: number,
): string {
  return evaluations
    .slice(0, count)
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
      const no = `${index + 1}.`;

      const expectedResponse = datasetEntry.expectedResponse;
      const expectedResponseString = expectedResponse
        ? responseToString(expectedResponse)
        : '';
      const expectedResponseEntry = expectedResponse
        ? `   **Expected response**: ${expectedResponseString}`
        : '';
      
      const responseString = removeNewlines(responseToString(response));
      return [
        `${no} **Response from model**: ${responseString}`,
        expectedResponseEntry,
        `   **Explanation from evaluator**: ${removeNewlines(reasoning)}`,
      ]
      .filter(line => line !== '')
      .join('\n');
    })
    .join('\n');
}