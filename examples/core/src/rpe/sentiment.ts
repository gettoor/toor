import { 
  RPEDataset,
  RPEState,
  RPEInput,
  splitRPEDataset,
  createRPEPrompt,
  llmRPEExecutor,
  judgeRPEEvaluator,
  defaultRPEAggregator,
  optimize,
  average,
  defaultRPEAnalyzer,
  defaultRPEPromptGenerator,
  bestScorePromptSelector,
} from '@gettoor/core';
import { EASY_DATASET } from './sentiment-dataset.js';

async function run(): Promise<void> {
  const dataset: RPEDataset = {
    entries: EASY_DATASET.slice(0, 3),
  };
  const [trainingDataset, validationDataset] = splitRPEDataset(dataset, 2, 1);

  const input: RPEInput = {
    seed: [
      createRPEPrompt(
        'What is the sentiment of the following input\n\n<<input>>',
      ),
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
    promptGeneratorParallelism: 8,
    promptGenerator: defaultRPEPromptGenerator({
      modelName: 'gemini:gemini-2.5-flash',
      modelParameters: {
        temperature: 0.0,
      },
    }),
    promptSelector: bestScorePromptSelector({}),
    stopAfterIteration: async (state: RPEState) => {
      return {
        stop: state.iterationNo === 0,
        stopReason: `Hit iteration limit`,
      };
    }
  };

  await optimize(input);
}

run().catch(console.error);