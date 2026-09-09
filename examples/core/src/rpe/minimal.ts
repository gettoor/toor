import fs from 'fs/promises';
import { 
  optimize,
  buildSinglePromptCandidateModules,
  rpeLightweight,
} from '@gettoor/core';
import { renderRPEInsightsToHTML } from '@gettoor/core/rpe-html-renderer';

async function run(): Promise<void> {
  const input = rpeLightweight({
    seed: [{
      modules: buildSinglePromptCandidateModules(
        'What is the sentiment of the following input\n\n{{input}}'
      ),
      candidateId: 'seed',
    }],
    dataset: {
      entries: [
        {
          datasetEntryId: 'e0',
          vars: {
            input: 'I absolutely loved the product. It exceeded all my expectations.',
          },
          expectedResponse: 'positive',
        },
        {
          datasetEntryId: 'e1',
          vars: {
            input: 'The battery barely lasts an hour.',
          },
          expectedResponse: 'negative',
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