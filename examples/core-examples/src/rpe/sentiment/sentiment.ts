import fs from 'fs/promises';
import { 
  RPECandidate,
  RPEDataset,
  RPEInput,
  orRPEStop,
  maximumIterationsRPEStop,
  minimumScoreRPEStop,
  singlePromptLLMRPEExecutor,
  epochBatchShuffledDatasetProvider,
  failurePrioritizedDatasetProvider,
  exactStringRPEEvaluator,
  defaultRPEAggregator,
  optimize,
  average,
  singlePromptRPEAnalyzer,
  singlePromptRPECandidateGenerator,
  isCandidateImprovedByScore,
  improvedCandidateSelector,
  buildSinglePromptCandidateModules,
  DEFAULT_RPE_LIGHTWEIGHT_CANDIDATE_GENERATOR_INSTRUCTIONS,
  patienceRPEStop,
  mergeRPEDatasets,
  SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_INSTRUCTIONS,
  evaluateSeedCandidatesRPEStateUpdate,
  testFinalCandidatesRPEStateUpdate,
  bestScoreFinalCandidateSelector,
  singlePromptJudgeRPEEvaluator,
  SCALAR_METRIC_RELEVANCE,
  SCALAR_METRIC_COHERENCE,
  SCALAR_METRIC_GRAMMAR,
  SCALAR_METRIC_HELPFULNESS,
} from '@gettoor/core';
import { renderRPEInsightsToHTML } from '@gettoor/core/rpe-html-renderer';
import {
  DYNASENT_TEST_HIGH_CONFIDENCE,
  DYNASENT_TRAINING_HIGH_CONFIDENCE,
  DYNASENT_VALIDATION_HIGH_CONFIDENCE,
} from './sentiment-dynasent-dataset.js';
import {
  CLARIN_EMO_TRAINING,
  CLARIN_EMO_VALIDATION,
  CLARIN_EMO_TEST,
} from './sentiment-clarin-emo-dataset.js';

async function run(): Promise<void> {
  const trainingDataset: RPEDataset = {
    entries: DYNASENT_TRAINING_HIGH_CONFIDENCE.slice(0, 20),
    // entries: CLARIN_EMO_TRAINING.slice(0, 20),
  };
  const validationDataset: RPEDataset = {
    entries: DYNASENT_VALIDATION_HIGH_CONFIDENCE.slice(0, 20),
    // entries: CLARIN_EMO_VALIDATION.slice(0, 20),
  };
  const testDataset: RPEDataset = {
    entries: DYNASENT_TEST_HIGH_CONFIDENCE.slice(0, 20),
    // entries: CLARIN_EMO_TEST.slice(0, 20),
  };
  const additionalInformation =
    'Valid responses are exactly positive, negative, or neutral.\n' +
    'Return exactly one lowercase label with no additional text.\n' +
    'All three labels remain valid even if a particular training or ' +
    'reflection minibatch contains only a subset of them.';

  const seedPrompt: RPECandidate = {
    modules: buildSinglePromptCandidateModules(
      'What is the sentiment of the following input\n\n{{input}}'
    ),
    candidateId: 'seed',
  };

  // const evaluator = exactStringRPEEvaluator();
  const evaluator = singlePromptJudgeRPEEvaluator({
    modelName: 'gemini:gemini-3.5-flash',
    modelParameters: {
      temperature: 0.3,
    },
    metrics: [
      SCALAR_METRIC_RELEVANCE,
      SCALAR_METRIC_GRAMMAR,
      SCALAR_METRIC_COHERENCE,
      SCALAR_METRIC_HELPFULNESS,
    ],
  });

  const input: RPEInput = {
    seed: [seedPrompt],
    dataset: mergeRPEDatasets(trainingDataset, validationDataset),
    trainingExecutor: singlePromptLLMRPEExecutor({
      modelName: 'gemini:gemini-2.5-flash',
      modelParameters: {
        temperature: 0.0,
      },
      // dataset: epochBatchShuffledDatasetProvider(trainingDataset, 5),
      dataset: failurePrioritizedDatasetProvider({
        dataset: trainingDataset,
        persistentFailureCount: 5,
        newFailureCount: 3,
        passedCount: 1,
        explorationCount: 1,
      }),
      parallelism: 8,
    }),
    trainingEvaluatorParallelism: 8,
    trainingEvaluator: evaluator,
    aggregatorParallelism: 8,
    aggregator: defaultRPEAggregator({
      aggregationFunc: average,
      passedEvaluationThreshold: 0.95,
    }),
    analyzerParallelism: 8,
    analyzer: singlePromptRPEAnalyzer({
      modelName: 'gemini:gemini-3.5-flash',
      modelParameters: {
        temperature: 0.3,
      },
      additionalInformation,
    }),
    candidateGenerator: singlePromptRPECandidateGenerator({
      parallelism: 8,
      modelName: 'gemini:gemini-3.5-flash',
      modelParameters: {
        temperature: 0.7,
      },
      additionalInformation,
      candidateInstructions:
      // DEFAULT_RPE_LIGHTWEIGHT_CANDIDATE_GENERATOR_INSTRUCTIONS,
      [SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_INSTRUCTIONS.defaultInstruction],
    }),
    candidateExecutor: singlePromptLLMRPEExecutor({
      modelName: 'gemini:gemini-2.5-flash',
      modelParameters: {
        temperature: 0.0,
      },
      dataset: validationDataset,
      parallelism: 8,
    }),
    candidateEvaluatorParallelism: 8,
    candidateEvaluator: evaluator,
    candidateSelector: improvedCandidateSelector({
      isCandidateImproved: isCandidateImprovedByScore,
      selectParentCandidatesIfBetter: true,
    }),
    finalCandidateSelector: bestScoreFinalCandidateSelector(),
    stopAfterIteration: orRPEStop([
      maximumIterationsRPEStop({ maxIterations: 16 }),
      minimumScoreRPEStop({ score: 0.975 }),
      patienceRPEStop({ noImprovementCount: 4, minScoreImprovement: 0.01 }),
    ]),
  };

  input.initializeState = evaluateSeedCandidatesRPEStateUpdate(input);
  input.updateStateOnFinish = testFinalCandidatesRPEStateUpdate({
    testDataset,
    executor: input.candidateExecutor,
    evaluatorParallelism: input.candidateEvaluatorParallelism!,
    evaluator: input.candidateEvaluator,
    aggregatorParallelism: input.aggregatorParallelism!,
    aggregator: input.aggregator,
  });

  const { insights } = await optimize(input);
  fs.writeFile('insights.json', JSON.stringify(insights, null, 2));

  const html = await renderRPEInsightsToHTML(insights);
  fs.writeFile('rpe.html', html);
}

run().catch(console.error);