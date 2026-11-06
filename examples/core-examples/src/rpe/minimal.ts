import fs from 'fs/promises';
import { 
  optimize,
  buildSinglePromptCandidateModules,
  rpeLightweight,
} from '@gettoor/core';
import { renderRPEInsightsToHTML } from '@gettoor/core/rpe-html-renderer';

async function run(): Promise<void> {
  const input = await rpeLightweight({
    seed: [{
      modules: buildSinglePromptCandidateModules(
        'What is the sentiment of the following input\n\n{{input}}'
      ),
      candidateId: 'seed',
    }],
    trainingDataset: {
      entries: [
        {
          datasetEntryId: 'training-loved-product',
          vars: {
            input:
              'I absolutely loved the product. It exceeded all my expectations.',
          },
          expectedResponse: 'positive',
        },
        {
          datasetEntryId: 'training-bad-battery',
          vars: {
            input: 'The battery barely lasts an hour.',
          },
          expectedResponse: 'negative',
        },
      ],
    },
    validationDataset: {
      entries: [
        {
          datasetEntryId: 'validation-okay-product',
          vars: {
            input: 'The product is okay, but it could be better.',
          },
          expectedResponse: 'neutral',
        },
      ],
    },
    testDataset: {
      entries: [
        {
          datasetEntryId: 'test-great-product',
          vars: {
            input: 'The product is great. I love it!',
          },
          expectedResponse: 'positive',
        },
      ],
    },
    modelName: 'gemini:gemini-2.5-flash',
    modelParameters: {
      temperature: 0.0,
    },
  });

  const { insights } = await optimize(input);
  const html = await renderRPEInsightsToHTML(insights);
  fs.writeFile('minimal.html', html);
}

run().catch(console.error);