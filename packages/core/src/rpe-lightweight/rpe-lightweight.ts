import { findUniquePlaceholders } from '../string/index.js';
import { average } from '../math/index.js';
import { ModelParameters } from '../llm/index.js';
import {
  RPECandidateValidator,
  RPEDataset,
  RPEExecutorOutputProcessor,
  RPEInput,
  RPEResponseProcessor,
  bestScoreFinalCandidateSelector,
  compositeRPECandidateValidator,
  defaultRPEAggregator,
  evaluateSeedCandidatesRPEStateUpdate,
  exactPlaceholdersRPECandidateValidator,
  failurePrioritizedDatasetProvider,
  identityRPEExecutorOutputProcessor,
  improvedCandidateSelector,
  isCandidateImprovedByScore,
  maximumIterationsRPEStop,
  mergeRPEDatasets,
  minimumScoreRPEStop,
  noPlaceholdersRPECandidateValidator,
  orRPEStop,
  patienceRPEStop,
  processRPEDatasetExpectedResponses,
  semanticRPECandidateValidator,
  testFinalCandidatesRPEStateUpdate,
  traverseRPEExecutorOutputProcessor,
} from '../rpe-core/index.js';
import { singlePromptLLMRPEExecutor } from './rpe-executor/index.js';
import { singlePromptJudgeRPEEvaluator } from './rpe-evaluator/index.js';
import { singlePromptRPEAnalyzer } from './rpe-analyzer/index.js';
import {
  SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_INSTRUCTIONS,
  singlePromptRPECandidateGenerator,
} from './rpe-candidate-generator/index.js';
import {
  DEFAULT_RPE_LIGHTWEIGHT_DEFAULT_PARALLELISM,
  DEFAULT_RPE_LIGHTWEIGHT_PASSED_EVALUATION_THRESHOLD,
  DEFAULT_RPE_LIGHTWEIGHT_CANDIDATE_GENERATOR_INSTRUCTIONS,
  DEFAULT_RPE_LIGHTWEIGHT_MAXIMUM_ITERATIONS,
  DEFAULT_RPE_LIGHTWEIGHT_MIN_SCORE,
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
export async function rpeLightweight(
  input: RPELightweightInput,
): Promise<RPEInput> {
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
  const maxIterations = input.maxIterations ??
    DEFAULT_RPE_LIGHTWEIGHT_MAXIMUM_ITERATIONS;
  const minScore = input.minScore ??
    DEFAULT_RPE_LIGHTWEIGHT_MIN_SCORE;
  
  const executorOutputProcessor = createExecutorOutputProcessor(input);
  const evaluator = input.evaluator ?? singlePromptJudgeRPEEvaluator({
    ...model(input.evaluatorModelName, input.evaluatorModelParameters),
    metrics: input.metrics,
  });

  const trainingDataset = await processDataset(
    input.trainingDataset,
    input.responseProcessor);
  const validationDataset = await processDataset(
    input.validationDataset,
    input.responseProcessor,
  );

  const rpeInput: RPEInput = {
    seed: input.seed,
    dataset: mergeRPEDatasets(trainingDataset, validationDataset),
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
      structuredOutputSchema: input.structuredOutputSchema,
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
        // [SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_INSTRUCTIONS.defaultInstruction],
      additionalContext,
      parallelism: 1,
    }),
    candidateValidator: createCandidateValidator(input),
    candidateExecutor: singlePromptLLMRPEExecutor({
      ...model(input.executorModelName, input.executorModelParameters),
      dataset: input.validationDataset,
      parallelism,
      structuredOutputSchema: input.structuredOutputSchema,
    }),
    candidateEvaluatorParallelism: parallelism,
    candidateEvaluator: evaluator,
    candidateSelector: improvedCandidateSelector({
      isCandidateImproved: isCandidateImprovedByScore,
      selectParentCandidatesIfBetter: true,
    }),
    finalCandidateSelector: bestScoreFinalCandidateSelector(),
    stopAfterIteration: orRPEStop([
      maximumIterationsRPEStop({ maxIterations }),
      minimumScoreRPEStop({ minScore }),
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

function createExecutorOutputProcessor(
  input: RPELightweightInput,
): RPEExecutorOutputProcessor {
  if (!input.responseProcessor) {
    return identityRPEExecutorOutputProcessor();
  }
  return traverseRPEExecutorOutputProcessor({
    responseProcessor: input.responseProcessor,
  });
}

function createCandidateValidator(
  input: RPELightweightInput,
): RPECandidateValidator | undefined {
  const { additionalContext } = input;
  const validators: RPECandidateValidator[] = [];

  const validPlaceholdersPerModule: Record<string, string[]> = {};
  const modulesWithoutPlaceholders: string[] = [];

  const seed0 = input.seed[0];
  Object.keys(seed0.modules).forEach((moduleKey) => {
    const module = seed0.modules[moduleKey];
    const placeholders = findUniquePlaceholders(module.content);

    if (placeholders.length) {
      validPlaceholdersPerModule[moduleKey] = placeholders;
    } else {
      modulesWithoutPlaceholders.push(moduleKey);
    }
  });


  if (Object.keys(validPlaceholdersPerModule).length) {
    validators.push(
      exactPlaceholdersRPECandidateValidator({ validPlaceholdersPerModule }),
    );
  }
  if (modulesWithoutPlaceholders.length) {
    validators.push(
      noPlaceholdersRPECandidateValidator({ modulesWithoutPlaceholders }),
    );
  }

  if (additionalContext) {
    validators.push(
      semanticRPECandidateValidator(
        {
          contract: additionalContext,
          modelName: input.modelName,
          modelProvider: input.modelProvider,
          modelParameters: input.modelParameters,
        },
      ),
    );
  }

  if (!validators.length) {
    return undefined;
  }
  return compositeRPECandidateValidator({ validators });
}

async function processDataset(
  dataset: RPEDataset,
  responseProcessor?: RPEResponseProcessor,
): Promise<RPEDataset> {
  if (!responseProcessor) {
    return dataset;
  }
  return processRPEDatasetExpectedResponses(dataset, responseProcessor);
}