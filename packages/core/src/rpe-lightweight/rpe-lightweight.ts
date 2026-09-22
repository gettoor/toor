import { average } from '../math/index.js';
import { ModelParameters } from '../llm/index.js';
import {
  bestScoreFinalCandidateSelector,
  defaultRPEAggregator,
  improvedCandidateSelector,
  isCandidateImprovedByScore,
  mergeRPEDatasets,
  RPEInput,
  RPEState,
} from '../rpe-core/index.js';
import { singlePromptLLMRPEExecutor } from './rpe-executor/index.js';
import { singlePromptJudgeRPEEvaluator } from './rpe-evaluator/index.js';
import { singlePromptRPEAnalyzer } from './rpe-analyzer/index.js';
import {
  singlePromptRPECandidateGenerator,
} from './rpe-candidate-generator/index.js';
import {
  DEFAULT_RPE_LIGHTWEIGHT_DEFAULT_PARALLELISM,
  DEFAULT_RPE_LIGHTWEIGHT_PASSED_EVALUATION_THRESHOLD,
  DEFAULT_RPE_LIGHTWEIGHT_CANDIDATE_GENERATOR_INSTRUCTIONS,
} from './rpe-lightweight-consts.js';
import { RPELightweightInput } from './rpe-lightweight-types.js';

/**
 * Creates a RPE lightweight preset. A lightweight RPE is for use in
 * a single-prompt context. It is a simplified RPE process optimize basic
 * prompts.
 * @category Reflective Prompt Evolution
 * @param input - Input for the RPE lightweight preset.
 * @returns RPE input for the lightweight preset.
 */
export function rpeLightweight(input: RPELightweightInput): RPEInput {
  const model = (name?: string, parameters?: ModelParameters) => {
    return {
      modelName: name ?? input.modelName,
      modelProvider: input.modelProvider,
      modelParameters: parameters ?? input.modelParameters,
    };
  };
  const parallelism = input.parallelism ??
    DEFAULT_RPE_LIGHTWEIGHT_DEFAULT_PARALLELISM;

  return {
    seed: input.seed,
    dataset: mergeRPEDatasets(
      input.trainingDataset,
      input.validationDataset,
    ),
    trainingExecutor: singlePromptLLMRPEExecutor({
      ...model(input.executorModelName, input.executorModelParameters),
      dataset: input.trainingDataset,
      parallelism,
    }),
    trainingEvaluatorParallelism: parallelism,
    trainingEvaluator: singlePromptJudgeRPEEvaluator({
      ...model(input.evaluatorModelName, input.evaluatorModelParameters),
      metrics: input.metrics,
    }),
    aggregatorParallelism: parallelism,
    aggregator: defaultRPEAggregator({
      aggregationFunc: input.aggregationFunc ?? average,
      passedEvaluationThreshold:
        input.passedEvaluationThreshold ??
        DEFAULT_RPE_LIGHTWEIGHT_PASSED_EVALUATION_THRESHOLD,
    }),
    analyzerParallelism: parallelism,
    analyzer: singlePromptRPEAnalyzer({
      ...model(input.analyzerModelName, input.analyzerModelParameters),
    }),
    candidateGenerator: singlePromptRPECandidateGenerator({
      ...model(
        input.candidateGeneratorModelName,
        input.candidateGeneratorModelParameters,
      ),
      candidateInstructions: input.candidateInstructions ??
        DEFAULT_RPE_LIGHTWEIGHT_CANDIDATE_GENERATOR_INSTRUCTIONS,
      parallelism,
    }),
    candidateExecutor: singlePromptLLMRPEExecutor({
      ...model(input.executorModelName, input.executorModelParameters),
      dataset: input.validationDataset,
      parallelism,
    }),
    candidateEvaluator: singlePromptJudgeRPEEvaluator({
      ...model(input.evaluatorModelName, input.evaluatorModelParameters),
      metrics: input.metrics,
    }),
    candidateSelector: improvedCandidateSelector({
      isCandidateImproved: isCandidateImprovedByScore,
      selectParentCandidatesIfBetter: true,
    }),
    finalCandidateSelector: bestScoreFinalCandidateSelector(),
    stopAfterIteration: async (state: RPEState) => {
      return {
        stop: state.iterationNo === 0,
        stopReason: `Hit iteration limit`,
      };
    }
  }
}