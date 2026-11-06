import fs from 'fs/promises';
import path from 'path';
import { JSONSchema7 } from 'ai';
import { 
  RPECandidate,
  RPEInput,
  optimize,
  buildSinglePromptCandidateModules,
  rpeLightweight,
  perFieldRPEEvaluator,
  exactStringRPEFieldEvaluator,
} from '@gettoor/core';
import { readRPEDatasetFromFile } from '@gettoor/core/rpe-io';

import { consoleRPEListeners } from '../console/index.js';
import { readFile, writeInsightsToFile } from '../io/index.js';

const dirname = path.dirname(new URL(import.meta.url).pathname);

async function run(): Promise<void> {
  const trainingDataset = readRPEDatasetFromFile(
    path.join(dirname, 'support-tickets.training.yml'),
    'yaml',
  );
  const validationDataset = readRPEDatasetFromFile(
    path.join(dirname, 'support-tickets.validation.yml'),
    'yaml',
  );
  const testDataset = readRPEDatasetFromFile(
    path.join(dirname, 'support-tickets.test.yml'),
    'yaml',
  );

  const structuredOutputSchema = {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['request', 'incident'],
        description: 'The type of the support ticket',
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        description: 'The priority of the support ticket',
      },
      department: {
        type: 'string',
        enum: [
          'Technical Support',
          'Billing and Payments',
          'Privacy & Data Protection',
        ],
        description: 'The department to which the support ticket belongs',
      },
    },
    required: ['type', 'priority', 'department'],
  } satisfies JSONSchema7;

  const seedPrompt = await readFile(
    dirname,
    'support-tickets-additional-seed-prompt.md',
  );
  const seedCandidate: RPECandidate = {
    modules: buildSinglePromptCandidateModules(seedPrompt),
    candidateId: 'seed',
  };

  const additionalContext = await readFile(
    dirname,
    'support-tickets-additional-context.md',
  );

  const evaluator = perFieldRPEEvaluator({
    evaluators: {
      type: exactStringRPEFieldEvaluator(),
      priority: exactStringRPEFieldEvaluator(),
      department: exactStringRPEFieldEvaluator(),
    },
  });  

  const input: RPEInput = await rpeLightweight({
    seed: [seedCandidate],
    trainingDataset: trainingDataset,
    validationDataset: validationDataset,
    testDataset: testDataset,
    additionalContext,
    modelName: 'gemini:gemini-3.5-flash-lite',
    modelParameters: {
      temperature: 0.3,
    },
    structuredOutputSchema,
    minScore: 1.0,
    evaluator,
  });  
  input.listeners = consoleRPEListeners();

  const { insights } = await optimize(input);
  await writeInsightsToFile(insights, 'support-tickets');
}

run().catch(console.error);