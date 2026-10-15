import fs from 'fs/promises';
import { JSONSchema7 } from 'ai';
import { 
  RPECandidate,
  RPEDataset,
  RPEInput,
  orRPEStop,
  maximumIterationsRPEStop,
  minimumScoreRPEStop,
  singlePromptLLMRPEExecutor,
  failurePrioritizedDatasetProvider,
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
  perFieldRPEEvaluator,
  exactStringRPEFieldEvaluator,
  stringArrayRPEFieldEvaluator,
  sortStringArrayTraverseRPEExecutorOutputCallback,
  traverseRPEExecutorOutputProcessor,
  identityRPEExecutorOutputProcessor,
} from '@gettoor/core';
import { renderRPEInsightsToHTML } from '@gettoor/core/rpe-html-renderer';
import {
  TRAINING_JOB_OFFERS,
  VALIDATION_JOB_OFFERS,
  TEST_JOB_OFFERS,
} from './job-offers-dataset.js';

async function run(): Promise<void> {
  const trainingDataset: RPEDataset = {
    entries: TRAINING_JOB_OFFERS.slice(0, 20),
  };
  const validationDataset: RPEDataset = {
    entries: VALIDATION_JOB_OFFERS.slice(0, 20),
  };
  const testDataset: RPEDataset = {
    entries: TEST_JOB_OFFERS.slice(0, 20),
  };
  const additionalContext = `
The dataset contains job offers for software positions. Each example includes a job description.
`;
  
  const structuredOutputSchema = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the software job offer, ' +
          'e.g. "Backend Software Engineer", "Senior Frontend Engineer", "Full Stack Developer"',
      },
      seniority: {
        type: 'string',
        description: 'The seniority level of the software job offer, ' +
          'e.g. "senior", "mid", "junior"',
      },
      role: {
        type: 'string',
        description: 'The role of the software job offer, ' +
          'e.g. "backend", "frontend", "fullstack"',
      },
      requiredSkills: {
        type: 'array',
        items: {
          type: 'string',
          description: 'A required skill for the software job offer, ' +
            'e.g. "Node.js", "PostgreSQL", "REST APIs"',
        },
        description: 'The required skills for the software job offer, ' +
          'e.g. ["Node.js", "PostgreSQL", "REST APIs"]',
      },
      preferredSkills: {
        type: 'array',
        items: {
          type: 'string',
          description: 'A preferred skill for the software job offer, ' +
            'e.g. "GraphQL", "Docker"',
        },
        description: 'The preferred skills for the software job offer, ' +
          'e.g. ["GraphQL", "Docker"]',
      },
    },
    required: ['title', 'seniority', 'role', 'requiredSkills', 'preferredSkills'],
  } satisfies JSONSchema7;

  const seedPrompt: RPECandidate = {
    modules: buildSinglePromptCandidateModules(
      'Given the below description of a software job offer, ' +
      'classify the title, seniority, role, required skills, and preferred skills\n\n' +
      'Description:\n{{jobDescription}}\n\n'
    ),
    candidateId: 'seed',
  };

  // const evaluator = singlePromptJudgeRPEEvaluator({
  //   modelName: 'gemini:gemini-3.5-flash-lite',
  //   modelParameters: {
  //     temperature: 0.3,
  //   },
  //   metrics: [
  //     SCALAR_METRIC_RELEVANCE,
  //     SCALAR_METRIC_GRAMMAR,
  //     SCALAR_METRIC_COHERENCE,
  //     SCALAR_METRIC_HELPFULNESS,
  //   ],
  // });

  /*
              "mid": 11,
              "senior": 9,
              "junior": 5,
              "lead": 2,
              "staff": 2,
              "principal": 1

  */
  
  const executorOutputProcessor = traverseRPEExecutorOutputProcessor({
    onResponseArray: sortStringArrayTraverseRPEExecutorOutputCallback(),
  });

  const evaluator = perFieldRPEEvaluator({
    evaluators: {
      title: exactStringRPEFieldEvaluator(),
      seniority: exactStringRPEFieldEvaluator({
        valueMapping: (valueRaw) => {
          return valueRaw.toLowerCase();
        },
      }),
      role: exactStringRPEFieldEvaluator({
        valueMapping: (valueRaw) => {
          const value = valueRaw.toLowerCase();
          const mapping: Record<string, string> = {
            'full stack': 'fullstack',
          };
          return mapping[value] ?? value;
        },
      }),
      requiredSkills: stringArrayRPEFieldEvaluator({
        sort: (strings) => strings.sort(),
      }),
      preferredSkills: stringArrayRPEFieldEvaluator({
        sort: (strings) => strings.sort(),
      }),
    },
  });

/*
              "backend": 5,
              "frontend": 4,
              "fullstack": 2,
              "devops": 3,
              "data": 3,
              "ml": 1,
              "qa": 2,
              "mobile": 3,
              "cloud": 1,
              "security": 1,
              "platform": 2,
              "embedded": 1,
              "database": 1,
              "game": 1

*/

  const input: RPEInput = {
    seed: [seedPrompt],
    dataset: mergeRPEDatasets(trainingDataset, validationDataset, testDataset),
    executorOutputProcessor,
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
      structuredOutputSchema,
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
      modelName: 'gemini:gemini-3.5-flash-lite',
      modelParameters: {
        temperature: 0.3,
      },
      additionalContext,
    }),
    candidateGenerator: singlePromptRPECandidateGenerator({
      parallelism: 8,
      modelName: 'gemini:gemini-3.5-flash-lite',
      modelParameters: {
        temperature: 0.7,
      },
      additionalContext,
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
      structuredOutputSchema,
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
      minimumScoreRPEStop({ minScore: 0.975 }),
      patienceRPEStop({ noImprovementCount: 4, minScoreImprovement: 0.01 }),
    ]),
  };

  input.initializeState = evaluateSeedCandidatesRPEStateUpdate(input);
  input.updateStateOnFinish = testFinalCandidatesRPEStateUpdate({
    testDataset,
    executorOutputProcessor,
    executor: input.candidateExecutor,
    evaluatorParallelism: input.candidateEvaluatorParallelism!,
    evaluator: input.candidateEvaluator,
    aggregatorParallelism: input.aggregatorParallelism!,
    aggregator: input.aggregator,
  });

  const { insights } = await optimize(input);
  fs.writeFile('insights.json', JSON.stringify(insights, null, 2));

  const html = await renderRPEInsightsToHTML(insights);
  fs.writeFile('support-tickets.html', html);
}

run().catch(console.error);
