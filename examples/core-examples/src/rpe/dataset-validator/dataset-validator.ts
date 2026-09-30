import {
  RPEDatasetEntry,
  RPEDatasetValidatorInput,
  validateRPEDataset,
} from '@gettoor/core';

function entry(
  id: string,
  text: string,
  expectedResponse: string,
): RPEDatasetEntry {
  return {
    datasetEntryId: id,
    vars: { text },
    expectedResponse,
  };
}

const VALIDATION_ENTRIES: RPEDatasetEntry[] = [
  entry(
    'validation/sunny-1',
    'The weather is sunny.',
    'positive',
  ),
  entry(
    'validation/sunny-2',
    'The weather is sunny.',
    'negative',
  ),
  entry(
    'validation/bright-sunny',
    'The weather is bright and sunny.',
    'positive',
  ),
  entry(
    'validation/sun-out',
    'The sun finally came out, although now it\'s almost too warm.',
    'positive',
  ),
  entry(
    'validation/temperature-dropped',
    'The temperature dropped by five degrees.',
    'positive',
  ),
];

const TRAIN_ENTRIES: RPEDatasetEntry[] = [
  entry(
    'train/sunny',
    'The weather is sunny.',
    'positive',
  ),
  entry(
    'train/rain-annoying',
    'The rain was annoying, but at least the air feels fresh now.',
    'negative',
  ),
  entry(
    'train/rain-around-3-pm',
    'It started raining around 3 PM.',
    'negative',
  ),
];

const TEST_ENTRIES: RPEDatasetEntry[] = [
  entry(
    'test/bright-sunny',
    'The weather is bright and sunny.',
    'positive',
  ),
  entry(
    'test/cloudy-again',
    'It\'s cloudy again, which is fine I guess.',
    'neutral',
  ),
  entry(
    'test/colder-tomorrow',
    'Tomorrow will be colder than today.',
    'neutral',
  ),
];

async function run(): Promise<void> {
  const input: RPEDatasetValidatorInput = {
    datasets: {
      validation: {
        entries: VALIDATION_ENTRIES,
      },
      train: {
        entries: TRAIN_ENTRIES,
      },
      test: {
        entries: TEST_ENTRIES,
      },
    },
    additionalContext:
      'The task is sentiment classification. Each input text should be ' +
      'classified as `positive`, `negative`, or `neutral`. When checking ' +
      'the dataset entries, verify that the expected response matches ' +
      'the overall sentiment expressed in the text, including implicit, ' +
      'mixed, sarcastic, or context - dependent sentiment.',
    modelName: 'gemini:gemini-3.5-flash',
    embeddingsModelName: 'gemini:gemini-embedding-001',
    modelParameters: {
      temperature: 0.1,
    },
  };
  const output = await validateRPEDataset(input);
  console.log(JSON.stringify(output, null, 2));
}

run().catch(console.error);
