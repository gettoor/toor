import fs from 'fs/promises';
import path from 'path';
import { 
  RPECandidate,
  RPEInput,
  optimize,
  buildSinglePromptCandidateModules,
  rpeLightweight,
} from '@gettoor/core';
import { readRPEDatasetFromFile } from '@gettoor/core/rpe-io';
import { renderRPEInsightsToHTML } from '@gettoor/core/rpe-html-renderer';

const dirname = path.dirname(new URL(import.meta.url).pathname);

async function run(): Promise<void> {
  const trainingDataset = readRPEDatasetFromFile(
    path.join(dirname, 'sentiment-dynasent.training.yml'),
    'yaml',
  );
  const validationDataset = readRPEDatasetFromFile(
    path.join(dirname, 'sentiment-dynasent.validation.yml'),
    'yaml',
  );
  const testDataset = readRPEDatasetFromFile(
    path.join(dirname, 'sentiment-dynasent.test.yml'),
    'yaml',
  );

  const additionalContext =
    'Valid responses are exactly positive, negative, or neutral.\n' +
    'Return exactly one lowercase label with no additional text.\n' +
    'All three labels remain valid even if a particular training or ' +
    'reflection minibatch contains only a subset of them.';

  const seedPrompt: RPECandidate = {
    modules: buildSinglePromptCandidateModules(
      'What is the sentiment of the following input\n\n{{input}}'
    ),
    candidateId: 'seed',
  };

  const input: RPEInput = rpeLightweight({
    seed: [seedPrompt],
    trainingDataset: trainingDataset,
    validationDataset: validationDataset,
    testDataset: testDataset,
    additionalContext,
    modelName: 'gemini:gemini-3.5-flash-lite',
    modelParameters: {
      temperature: 0.3,
    },
  });

  const { insights } = await optimize(input);
  fs.writeFile('insights.json', JSON.stringify(insights, null, 2));

  const html = await renderRPEInsightsToHTML(insights);
  fs.writeFile('sentiment.html', html);
}

run().catch(console.error);