import { generateText, Output } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { InternalToorError, ToorError } from '../../errors/index.js';
import { DistributionRange } from '../../math/index.js';
import { runParallelBatchesOrThrow } from '../../concurrency/index.js';
import {
  MetricResult,
  ModelParameters,
  buildModelCallSettings,
} from '../../llm/index.js';
import {
  DefaultModelProvider,
  ModelProvider,
} from '../../model-provider/index.js';
import { modelParametersToRPEInfo } from '../rpe-info/index.js';
import { findCandidateById, RPEState } from '../rpe-state/index.js';
import {
  buildSinglePromptCandidateModules,
  requireSinglePromptCandidateModule,
  RPECandidate,
} from '../rpe-candidate/index.js';
import { RPEEvaluatorOutput } from '../rpe-evaluator/rpe-evaluator-types.js';
import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';
import { RPEAnalyzerOutput } from '../rpe-analyzer/index.js';
import { 
  SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_PROMPT,
} from './single-prompt-rpe-candidate-generator-prompt.js';
import { 
  RPECandidateGenerator,
  RPECandidateGeneratorInfo,
  RPECandidateGeneratorInput,
  RPECandidateGeneratorOutput,
  RPECandidateGeneratorCandidate,
} from './rpe-candidate-generator-types.js';
import {
  DEFAULT_SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_PARALLELISM,
} from './single-prompt-rpe-candidate-generator-consts.js';
import { 
  SinglePromptRPECandidateGeneratorInput,
  SinglePromptRPECandidateGeneratorOutputSchema,
} from './single-prompt-rpe-candidate-generator-types.js';

/**
 * Creates a single-prompt RPE candidate generator. The generate expects
 * a candidate with a single module `prompt`. It generates a candidate with
 * a single module `prompt` with the improved prompt.
 * @category Reflective Prompt Evolution
 * @param input - Input for the candidate generator.
 * @returns Candidate generator.
 */
export function singlePromptRPECandidateGenerator(
  input: SinglePromptRPECandidateGeneratorInput,
): RPECandidateGenerator {
  const { modelName, modelParameters, parallelism } = input;
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();

  return {
    run: async (
      state: RPEState,
      input: RPECandidateGeneratorInput,
    ): Promise<RPECandidateGeneratorOutput> => {
      const { iteration } = state;
      const { aggregatedEvaluations, analyses } = iteration;
      if (!aggregatedEvaluations) {
        throw new InternalToorError(
          `Aggregated evaluations not found during candidate generation`,
        );
      }
      if (!analyses) {
        throw new InternalToorError(
          `Analyses not found during candidate generation`,
        );
      }

      // tasks
      const tasks = aggregatedEvaluations.map(async (aggregation, index) => {
        const aggregationCandidateId = aggregation.candidateRef.candidateId;

        // find analysis
        const analysis = analyses.find(analysis => {
          return analysis.candidateRef.candidateId === aggregationCandidateId;
        });
        if (!analysis) {
          throw new InternalToorError(
            `Analysis not found for candidate ` +
            `${ToorError.quote(aggregationCandidateId)} ` +
            `during candidate generation`,
          );
        }

        // generate candidate
        const newCandidateId = `i${state.iterationNo}p${index}`;
        const candidate = await generateCandidate(
          modelProvider,
          modelName,
          modelParameters,
          findCandidateById(state, aggregationCandidateId),
          newCandidateId,
          aggregation,
          analysis,
        );
        return candidate;
      });

      // run tasks in parallel
      const outputs = await runParallelBatchesOrThrow(
        tasks,
        parallelism ?? DEFAULT_SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_PARALLELISM,
      );
      return { candidates: outputs.flat() };
    },

    getInfo: async (): Promise<RPECandidateGeneratorInfo> => {
      return {
        name: 'Single-prompt Candidate Generator',
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

async function generateCandidate(
  modelProvider: ModelProvider,
  modelName: string,
  modelParameters: ModelParameters | undefined,
  candidate: RPECandidate,
  newCandidateId: string,
  aggregation: RPEAggregatorOutput,
  analysis: RPEAnalyzerOutput,
): Promise<RPECandidateGeneratorCandidate> {
  const prompt = replacePlaceholders(
    SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_PROMPT,
    {
      original_prompt: requireSinglePromptCandidateModule(
        candidate.modules,
      ),
      aggregated_score: aggregation.aggregatedScore,
      aggregated_metrics: aggregatedMetricsForPrompt(
        aggregation.aggregatedMetrics ?? {},
      ),
      score_distribution: scoreDistributionForPrompt(
        aggregation.scoreDistribution,
      ),
      strengths: analysis.strengths.join('\n'),
      weaknesses: analysis.weaknesses.join('\n'),
      recommendations: analysis.recommendations.join('\n'),
      failure_patterns: analysis.failurePatterns.join('\n'),
      passed_evaluations: explanationsForPrompt(
        aggregation.passedEvaluations,
      ),
      failed_evaluations: explanationsForPrompt(
        aggregation.failedEvaluations,
      ),
    },
  );

  const model = await modelProvider.getModel(modelName);
  const { output, usage } = await generateText({
    model: model.model,
    prompt: prompt.text,
    ...buildModelCallSettings(modelParameters),
    output: Output.object({
      schema: SinglePromptRPECandidateGeneratorOutputSchema,
    })
  });

  const generatedCandidate: RPECandidateGeneratorCandidate = {
    candidate: {
      candidateId: newCandidateId,
      modules: buildSinglePromptCandidateModules(output.prompt),
      parentCandidateIds: [candidate.candidateId],
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
  return generatedCandidate;
}

function aggregatedMetricsForPrompt(
  metrics: Record<string, MetricResult>,
): string {
  if (Object.keys(metrics).length === 0) {
    return 'No aggregated metrics';
  }

  const names = Object.keys(metrics).sort();
  return names.map(name => {
    const { normalizedScore, reasoning } = metrics[name];
    const reasoningString = reasoning ? ` (${reasoning})` : '';
    return `- ${name}: ${normalizedScore.toFixed(2)}${reasoningString}`;
  }).join('\n');
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