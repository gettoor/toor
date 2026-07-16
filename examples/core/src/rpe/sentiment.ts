import { 
  RPEDataset,
  RPEState,
  RPEInput,
  splitRPEDataset,
  llmRPEExecutor,
  judgeRPEEvaluator,
  optimize,
} from '@gettoor/core';
import { EASY_DATASET } from './sentiment-dataset.js';

async function run(): Promise<void> {
  const dataset: RPEDataset = {
    entries: EASY_DATASET.slice(0, 1),
  };
  const [trainingDataset, validationDataset] = splitRPEDataset(dataset, 2, 1);

  const input: RPEInput = {
    seed: [
      {
        prompt: 'What is the sentiment of the following input\n\n<<input>>',
      },
    ],
    trainingDataset: {
      entries: dataset.entries,
    },
    validationDataset: {
      entries: [],
    },
    executor: llmRPEExecutor({
      modelName: 'gemini:gemini-2.5-flash',
      modelParameters: {
        temperature: 0.0,
      },
    }),
    evaluator: judgeRPEEvaluator({
      modelName: 'gemini:gemini-2.5-flash',
      modelParameters: {
        temperature: 0.0,
      },
    }),
    stopFunc: async (state: RPEState) => {
      return state.iteration === 0;
    }
  };

  await optimize(input);
}

run().catch(console.error);