import fs from 'fs/promises';
import { 
  RPEDataset,
  RPEState,
  RPEInput,
  splitRPEDataset,
  llmRPEExecutor,
  judgeRPEEvaluator,
  defaultRPEAggregator,
  optimize,
  average,
  defaultRPEAnalyzer,
  defaultRPECandidateGenerator,
  bestScoreCandidateSelector,
  SCALAR_METRIC_CORRECTNESS,
  SCALAR_METRIC_COMPLETENESS,
  SCALAR_METRIC_RELEVANCE,
} from '@gettoor/core';
import { renderRPEInsightsToHTML } from '@gettoor/core/rpe-html-renderer';
import { EASY_DATASET } from './sentiment-dataset.js';

async function run(): Promise<void> {
  const dataset: RPEDataset = {
    entries: EASY_DATASET.slice(0, 3),
  };
  const [trainingDataset, validationDataset] = splitRPEDataset(dataset, 2, 1);

  const input: RPEInput = {
    seed: [
      {
        candidate: 'What is the sentiment of the following input\n\n<<input>>',
        candidateId: 'seed',
      },
    ],
    trainingDataset: {
      entries: trainingDataset.entries,
    },
    validationDataset: {
      entries: validationDataset.entries,
    },
    executorParallelism: 8,
    executor: llmRPEExecutor({
      modelName: 'gemini:gemini-2.5-flash',
      modelParameters: {
        temperature: 0.0,
      },
    }),
    evaluatorParallelism: 8,
    evaluator: judgeRPEEvaluator({
      modelName: 'gemini:gemini-2.5-flash',
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
    analyzer: defaultRPEAnalyzer({
      modelName: 'gemini:gemini-2.5-flash',
      modelParameters: {
        temperature: 0.0,
      },
    }),
    candidateGeneratorParallelism: 8,
    candidateGenerator: defaultRPECandidateGenerator({
      modelName: 'gemini:gemini-2.5-flash',
      modelParameters: {
        temperature: 0.0,
      },
    }),
    candidateSelector: bestScoreCandidateSelector({}),
    stopAfterIteration: async (state: RPEState) => {
      return {
        stop: state.iterationNo === 0,
        stopReason: `Hit iteration limit`,
      };
    }
  };

  const { insights } = await optimize(input);
  fs.writeFile('insights.json', JSON.stringify(insights, null, 2));

  const html = await renderRPEInsightsToHTML(insights);
  fs.writeFile('rpe.html', html);
}

run().catch(console.error);