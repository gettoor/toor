import { generateText, Output } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { 
  buildModelCallSettings,
  MetricResult,
  removeNewlines,
} from '../../llm/index.js';
import { DefaultModelProvider } from '../../model-provider/index.js';
import {
  responseToString,
  modelParametersToRPEInfo,
  requireSinglePromptCandidateModule,
  RPEEvaluatorOutput,
  findCandidateById,
  findCandidateAncestorsById,
  RPEState,
  RPEAnalyzer,
  RPEAnalyzerInfo,
  RPEAnalyzerInput,
  RPEAnalyzerOutput,
  findGeneratedCandidateById,
} from '../../rpe-core/index.js';
import {
  SINGLE_PROMPT_RPE_ANALYZER_PROMPT,
} from './single-prompt-rpe-analyzer-prompt.js';
import { 
  SinglePromptRPEAnalyzerInput,
  SinglePromptRPEAnalyzerOutputSchema,
} from './single-prompt-rpe-analyzer-types.js';

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
    additionalInformation,
    prompt: analyzerPrompt,
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
        analyzerPrompt ?? SINGLE_PROMPT_RPE_ANALYZER_PROMPT,
        {
          original_prompt: requireSinglePromptCandidateModule(
            candidate.modules,
          ),
          additional_information:
            additionalInformation ?? 'No additional information provided.',
          aggregated_score: input.aggregation.aggregatedScore,
          aggregated_metrics: aggregatedMetricsForPrompt(
            input.aggregation.aggregatedMetrics ?? {},
          ),
          passed_explanations: explanationsForPrompt(
            input.aggregation.passedEvaluations,
          ),
          failed_examples: failedExamplesForPrompt(
            input.aggregation.failedEvaluations,
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
      

      const failedExampleAnalysis = output.failedExampleAnalysis
        .filter((_, index) => {
          return index < input.aggregation.failedEvaluations.length;
        })
        .map((analysis, index) => {
          const evaluation = input.aggregation.failedEvaluations[index];
          return {
            datasetEntryId: evaluation.datasetEntry.datasetEntryId,
            ...analysis,
          }
        },
      );

      return {
        candidateRef: input.aggregation.candidateRef,
        strengths: output.strengths.map(strength => strength.description),
        failedExampleAnalysis,
        recommendations: output.recommendations.map(recommendation => {
          return `${recommendation.goal} (${recommendation.reason})`;
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
  const sorted = Object.keys(metrics).sort((a, b) => a.localeCompare(b));
  return sorted
    .map(name => {
      const metric = metrics[name];
      const reasoning = metric.reasoning ? ` (${metric.reasoning})` : '';
      return `${name}: ${metric.normalizedScore.toFixed(2)}${reasoning}`;
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
): string {
  return evaluations
    .map(({ response, datasetEntry, reasoning }, index) => {
      const no = `${index + 1}.`;

      const expectedResponse = datasetEntry.expectedResponse
        ? `   **Expected response**: ` +
          `${responseToString(datasetEntry.expectedResponse)}`
        : '';
      const expectedResponseReasoning = datasetEntry.expectedResponseReasoning
        ? `   **Expected response reasoning**: ` +
          `${datasetEntry.expectedResponseReasoning}`
        : '';
      
      const responseString = removeNewlines(responseToString(response));
      return [
        `${no} **Response from model**: ${responseString}`,
        expectedResponse,
        expectedResponseReasoning,
        `   **Explanation from evaluator**: ${removeNewlines(reasoning)}`,
      ]
      .filter(line => line !== '')
      .join('\n');
    })
    .join('\n');
}