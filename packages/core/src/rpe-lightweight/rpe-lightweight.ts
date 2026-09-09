import { average } from '../math/index.js';
import { ModelParameters } from '../llm/index.js';
import {
  defaultRPEAggregator,
  improvedCandidateSelector,
  isCandidateImprovedByScore,
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
  DEFAULT_RPE_LIGHTWEIGHT_PASSED_EVALUATION_THRESHOLD,
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

  return {
    seed: input.seed,
    datasetEntries: input.dataset.entries,
    executor: singlePromptLLMRPEExecutor({
      ...model(input.executorModelName, input.executorModelParameters),
      dataset: input.dataset,
    }),
    evaluator: singlePromptJudgeRPEEvaluator({
      ...model(input.evaluatorModelName, input.evaluatorModelParameters),
      metrics: input.metrics,
    }),
    aggregator: defaultRPEAggregator({
      aggregationFunc: input.aggregationFunc ?? average,
      passedEvaluationThreshold:
        input.passedEvaluationThreshold ??
        DEFAULT_RPE_LIGHTWEIGHT_PASSED_EVALUATION_THRESHOLD,
    }),
    analyzer: singlePromptRPEAnalyzer({
      ...model(input.analyzerModelName, input.analyzerModelParameters),
    }),
    candidateGenerator: singlePromptRPECandidateGenerator({
      ...model(
        input.candidateGeneratorModelName,
        input.candidateGeneratorModelParameters,
      ),
    }),
    candidateSelector: improvedCandidateSelector({
      isCandidateImproved: isCandidateImprovedByScore,
      selectParentCandidatesIfBetter: true,
    }),
    stopAfterIteration: async (state: RPEState) => {
      return {
        stop: state.iterationNo === 0,
        stopReason: `Hit iteration limit`,
      };
    }
  }
}