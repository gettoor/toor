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
} from '@gettoor/core';
import { EASY_DATASET } from './sentiment-dataset.js';

async function run(): Promise<void> {
  const dataset: RPEDataset = {
    entries: EASY_DATASET.slice(0, 2),
  };
  const [trainingDataset, validationDataset] = splitRPEDataset(dataset, 2, 1);

  const input: RPEInput = {
    seed: [
      createRPEPrompt(
        'What is the sentiment of the following input\n\n<<input>>',
      ),
    ],
    trainingDataset: {
      entries: dataset.entries,
    },
    validationDataset: {
      entries: [],
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
      passedEvaluationThreshold: 0.5,
    }),
    stopFunc: async (state: RPEState) => {
      return state.iteration === 0;
    }
  };

  await optimize(input);
}

run().catch(console.error);