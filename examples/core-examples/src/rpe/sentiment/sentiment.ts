import fs from 'fs/promises';
import path from 'path';
import { 
  RPECandidate,
  RPEInput,
  optimize,
  buildSinglePromptCandidateModules,
  rpeLightweight,
  exactStringRPEEvaluator,
} from '@gettoor/core';
import { readRPEDatasetFromFile } from '@gettoor/core/rpe-io';

import { consoleRPEListeners } from '../console/index.js';
import { readFile, writeInsightsToFile } from '../io/index.js';

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

  const seedPrompt = await readFile(
    dirname,
    'sentiment-seed-prompt.md',
  );
  const seedCandidate: RPECandidate = {
    modules: buildSinglePromptCandidateModules(seedPrompt),
    candidateId: 'seed',
  };

  const additionalContext = await readFile(
    dirname,
    'sentiment-additional-context.md',
  );
  const evaluator = exactStringRPEEvaluator();

  const input: RPEInput = await rpeLightweight({
    seed: [seedCandidate],
    trainingDataset: trainingDataset,
    validationDataset: validationDataset,
    testDataset: testDataset,
    additionalContext,
    modelName: 'gemini:gemini-3.5-flash-lite',
    // modelName: 'openai:gpt-6.1-sol',
    modelParameters: {
      // temperature: 0.3,
    },
    evaluator,
  });
  input.listeners = consoleRPEListeners();

  const { insights } = await optimize(input);
  await writeInsightsToFile(insights, 'sentiment');
}

run().catch(console.error);