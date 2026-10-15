import {
  RPEDatasetEntry,
  RPEDatasetValidatorInput,
  validateRPEDataset,
} from '@gettoor/core';
import {
  TEST_SUPPORT_TICKETS,
  TRAINING_SUPPORT_TICKETS,
  VALIDATION_SUPPORT_TICKETS,
} from '../support-tickets/support-tickets-dataset.js';
import { TEST_JOB_OFFERS, TRAINING_JOB_OFFERS, VALIDATION_JOB_OFFERS } from '../job-offers/job-offers-dataset.js';

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
        // entries: VALIDATION_ENTRIES,
        // entries: VALIDATION_SUPPORT_TICKETS,
        entries: VALIDATION_JOB_OFFERS,
      },
      train: {
        // entries: TRAIN_ENTRIES,
        // entries: TRAINING_SUPPORT_TICKETS,
        entries: TRAINING_JOB_OFFERS,
      },
      test: {
        // entries: TEST_ENTRIES,
        // entries: TEST_SUPPORT_TICKETS,
        entries: TEST_JOB_OFFERS,
      },
    },
    additionalContext: 
'The dataset contains customer support tickets. Each example includes a user-written support message and an expected structured classification with three fields: type, priority, and department.' +
'The type must be one of: request, incident.' +
'The priority must be one of: low, medium, high.' +
`
- **High** — The issue prevents the user from continuing their work, significantly slows down their work, affects many users, or has a reasonable potential to affect many users. Also use high when critical functionality is unavailable or there is a serious risk of broader disruption.
- **Medium** — The default priority when the issue does not clearly qualify as high or low. Use medium when the issue has a meaningful impact, but users can still continue working and the scope is limited.
- **Low** — The issue affects only one or a small number of users, users can continue their work, and the impact on productivity is minor. This also includes minor inconveniences, cosmetic issues, and non-urgent problems.
` +
'The department must be one of: Technical Support, Billing and Payments, Privacy & Data Protection.' +
'The expected response should represent the most appropriate classification based only on the information provided in the ticket message.',
    // additionalContext:
    //   'The task is sentiment classification. Each input text should be ' +
    //   'classified as `positive`, `negative`, or `neutral`. When checking ' +
    //   'the dataset entries, verify that the expected response matches ' +
    //   'the overall sentiment expressed in the text, including implicit, ' +
    //   'mixed, sarcastic, or context - dependent sentiment.',
    modelName: 'gemini:gemini-3.5-flash-lite',
    embeddingsModelName: 'gemini:gemini-embedding-001',
    modelParameters: {
      temperature: 0.1,
    },
    expectedResponseDistributionImbalanceThreshold: 0.0,
  };
  const output = await validateRPEDataset(input);
  console.log(JSON.stringify(output, null, 2));
}

run().catch(console.error);
