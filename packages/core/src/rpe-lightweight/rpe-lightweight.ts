import { average } from '../math/index.js';
import { ModelParameters } from '../llm/index.js';
import {
  RPEInput,
  bestScoreFinalCandidateSelector,
  defaultRPEAggregator,
  evaluateSeedCandidatesRPEStateUpdate,
  failurePrioritizedDatasetProvider,
  identityRPEExecutorOutputProcessor,
  improvedCandidateSelector,
  isCandidateImprovedByScore,
  maximumIterationsRPEStop,
  mergeRPEDatasets,
  minimumScoreRPEStop,
  orRPEStop,
  patienceRPEStop,
  testFinalCandidatesRPEStateUpdate,
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
  const additionalContext = input.additionalContext;
  const parallelism = input.parallelism ??
    DEFAULT_RPE_LIGHTWEIGHT_DEFAULT_PARALLELISM;
  
  const executorOutputProcessor = identityRPEExecutorOutputProcessor();
  const evaluator = singlePromptJudgeRPEEvaluator({
    ...model(input.evaluatorModelName, input.evaluatorModelParameters),
    metrics: input.metrics,
  });

  const rpeInput: RPEInput = {
    seed: input.seed,
    dataset: mergeRPEDatasets(
      input.trainingDataset,
      input.validationDataset,
    ),
    executorOutputProcessor,
    trainingExecutor: singlePromptLLMRPEExecutor({
      ...model(input.executorModelName, input.executorModelParameters),
      dataset: failurePrioritizedDatasetProvider({
        dataset: input.trainingDataset,
        persistentFailureCount: 5,
        newFailureCount: 3,
        passedCount: 1,
        explorationCount: 1,
      }),
      parallelism,
    }),
    trainingEvaluatorParallelism: parallelism,
    trainingEvaluator: evaluator,
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
      additionalContext,
    }),
    candidateGenerator: singlePromptRPECandidateGenerator({
      ...model(
        input.candidateGeneratorModelName,
        input.candidateGeneratorModelParameters,
      ),
      candidateInstructions: input.candidateInstructions ??
        DEFAULT_RPE_LIGHTWEIGHT_CANDIDATE_GENERATOR_INSTRUCTIONS,
      additionalContext,
      parallelism,
    }),
    candidateExecutor: singlePromptLLMRPEExecutor({
      ...model(input.executorModelName, input.executorModelParameters),
      dataset: input.validationDataset,
      parallelism,
    }),
    candidateEvaluatorParallelism: parallelism,
    candidateEvaluator: evaluator,
    candidateSelector: improvedCandidateSelector({
      isCandidateImproved: isCandidateImprovedByScore,
      selectParentCandidatesIfBetter: true,
    }),
    finalCandidateSelector: bestScoreFinalCandidateSelector(),
    stopAfterIteration: orRPEStop([
      maximumIterationsRPEStop({ maxIterations: 16 }),
      minimumScoreRPEStop({ score: 0.95 }),
      patienceRPEStop({ noImprovementCount: 4, minScoreImprovement: 0.01 }),
    ]),
  }

  rpeInput.initializeState = evaluateSeedCandidatesRPEStateUpdate(rpeInput);
  rpeInput.updateStateOnFinish = testFinalCandidatesRPEStateUpdate({
    testDataset: input.testDataset,
    executorOutputProcessor,
    executor: rpeInput.candidateExecutor,
    evaluatorParallelism: rpeInput.candidateEvaluatorParallelism!,
    evaluator: rpeInput.candidateEvaluator,
    aggregatorParallelism: rpeInput.aggregatorParallelism!,
    aggregator: rpeInput.aggregator,
  });  

  return rpeInput;
}