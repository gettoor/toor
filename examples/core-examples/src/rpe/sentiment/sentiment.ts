import fs from 'fs/promises';
import path from 'path';
import { 
  RPECandidate,
  RPEInput,
  optimize,
  buildSinglePromptCandidateModules,
  rpeLightweight,
  exactStringRPEEvaluator,
  rpeLightweightExecutorAndCriticModels,
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
  const seedInputs = await readFile(
    dirname,
    'sentiment-seed-inputs.md',
  );
  const seedCandidate: RPECandidate = {
    modules: buildSinglePromptCandidateModules({
      prompt: seedPrompt,
      inputs: seedInputs,
    }),
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
    ...rpeLightweightExecutorAndCriticModels({
      executorModelName: 'openai:gpt-5-nano',
      criticModelName: 'openai:gpt-6-luna',
      // executorModelName: 'gemini:gemini-3.5-flash-lite',
      // criticModelName: 'gemini:gemini-3.8-flash',
      // executorModelName: 'anthropic:claude-haiku-5-5',
      // criticModelName: 'anthropic:claude-sonnet-5-5',
    }),    
    evaluator,
  });
  input.listeners = consoleRPEListeners();

  const { insights } = await optimize(input);
  await writeInsightsToFile(insights, 'sentiment');
}

run().catch(console.error);