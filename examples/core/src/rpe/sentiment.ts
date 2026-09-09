import fs from 'fs/promises';
import { 
  RPECandidate,
  RPEDataset,
  RPEInput,
  orRPEStop,
  maximumIterationsRPEStop,
  minimumScoreRPEStop,
  singlePromptLLMRPEExecutor,
  singlePromptJudgeRPEEvaluator,
  defaultRPEAggregator,
  optimize,
  average,
  singlePromptRPEAnalyzer,
  singlePromptRPECandidateGenerator,
  isCandidateImprovedByScore,
  improvedCandidateSelector,
  SCALAR_METRIC_CORRECTNESS,
  SCALAR_METRIC_COMPLETENESS,
  SCALAR_METRIC_RELEVANCE,
  buildSinglePromptCandidateModules,
  DEFAULT_RPE_LIGHTWEIGHT_CANDIDATE_GENERATOR_INSTRUCTIONS,
} from '@gettoor/core';
import { renderRPEInsightsToHTML } from '@gettoor/core/rpe-html-renderer';
import { HARD_DATASET } from './sentiment-dataset.js';

async function run(): Promise<void> {
  const trainingDataset: RPEDataset = {
    entries: HARD_DATASET.slice(0, 4),
  };
  const seedPrompt: RPECandidate = {
    modules: buildSinglePromptCandidateModules(
      'What is the sentiment of the following input\n\n{{input}}'
    ),
    candidateId: 'seed',
  };

  const input: RPEInput = {
    seed: [seedPrompt],
    datasetEntries: [...trainingDataset.entries],
    executor: singlePromptLLMRPEExecutor({
      modelName: 'gemini:gemini-2.5-flash',
      modelParameters: {
        temperature: 0.0,
      },
      dataset: trainingDataset,
      parallelism: 8,
    }),
    evaluatorParallelism: 8,
    evaluator: singlePromptJudgeRPEEvaluator({
      modelName: 'gemini:gemini-3.5-flash',
      modelParameters: {
        temperature: 0.0,
      },
      metrics: [
        SCALAR_METRIC_CORRECTNESS,
        SCALAR_METRIC_COMPLETENESS,
        SCALAR_METRIC_RELEVANCE,
      ],
    }),
    aggregatorParallelism: 8,
    aggregator: defaultRPEAggregator({
      aggregationFunc: average,
      passedEvaluationThreshold: 0.95,
    }),
    analyzerParallelism: 8,
    analyzer: singlePromptRPEAnalyzer({
      modelName: 'gemini:gemini-3.5-flash',
      modelParameters: {
        temperature: 0.0,
      },
    }),
    candidateGenerator: singlePromptRPECandidateGenerator({
      parallelism: 8,
      modelName: 'gemini:gemini-3.5-flash',
      modelParameters: {
        temperature: 0.7,
      },
      candidateInstructions:
        DEFAULT_RPE_LIGHTWEIGHT_CANDIDATE_GENERATOR_INSTRUCTIONS,
    }),
    candidateSelector: improvedCandidateSelector({
      isCandidateImproved: isCandidateImprovedByScore,
      selectParentCandidatesIfBetter: true,
    }),
    stopAfterIteration: orRPEStop([
      maximumIterationsRPEStop({ maxIterations: 1 }),
      minimumScoreRPEStop({ score: 0.95 }),
    ]),
  };

  const { insights } = await optimize(input);
  fs.writeFile('insights.json', JSON.stringify(insights, null, 2));

  const html = await renderRPEInsightsToHTML(insights);
  fs.writeFile('rpe.html', html);
}

run().catch(console.error);