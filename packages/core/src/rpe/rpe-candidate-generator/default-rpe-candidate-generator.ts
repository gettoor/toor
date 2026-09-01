import { generateText, Output } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { DistributionRange } from '../../math/index.js';
import { MetricResult, buildModelCallSettings } from '../../llm/index.js';
import { DefaultModelProvider } from '../../model-provider/index.js';
import { modelParametersToRPEInfo } from '../rpe-info/index.js';
import { RPEEvaluatorOutput } from '../rpe-evaluator/rpe-evaluator-types.js';
import { 
  DEFAULT_RPE_CANDIDATE_GENERATOR_PROMPT,
} from './default-rpe-candidate-generator-prompt.js';
import { 
  RPECandidateGenerator,
  RPECandidateGeneratorInfo,
  RPECandidateGeneratorInput,
  RPECandidateGeneratorOutput,
  RPECandidateGeneratorCandidate,
} from './rpe-candidate-generator-types.js';
import { 
  DefaultRPECandidateGeneratorInput,
  DefaultRPECandidateGeneratorOutputSchema,
} from './default-rpe-candidate-generator-types.js';

export function defaultRPECandidateGenerator(
  input: DefaultRPECandidateGeneratorInput,
): RPECandidateGenerator {
  const { modelName, modelParameters } = input;
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();

  return {
    run: async (
      input: RPECandidateGeneratorInput,
    ): Promise<RPECandidateGeneratorOutput> => {
      const prompt = replacePlaceholders(
        DEFAULT_RPE_CANDIDATE_GENERATOR_PROMPT,
        {
          original_prompt: input.candidate.candidate,
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
      const { output, usage } = await generateText({
        model: model.model,
        prompt: prompt.text,
        ...buildModelCallSettings(modelParameters),
        output: Output.object({
          schema: DefaultRPECandidateGeneratorOutputSchema,
        })
      });

      const generatedCandidate: RPECandidateGeneratorCandidate = { 
        candidate: {
          candidate: output.prompt,
          parentCandidateIds: [input.candidate.candidateId],
        },
        changes: output.changes.map(change => ({
          description: change.description,
          reasoning: change.reasoning,
        })),
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
      return {
        candidates: [generatedCandidate],
      }
    },

    getInfo: async (): Promise<RPECandidateGeneratorInfo> => {
      return {
        name: 'Default Prompt Generator',
        properties: [
          {
            key: 'model',
            value: modelProvider.getProviderModelName(modelName),
            description: 'Model name used for the prompt generation.',
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