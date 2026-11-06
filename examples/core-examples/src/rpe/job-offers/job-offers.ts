import { JSONSchema7 } from 'ai';
import path from 'path';
import { 
  RPECandidate,
  RPEInput,
  optimize,
  buildSinglePromptCandidateModules,
  perFieldRPEEvaluator,
  exactStringRPEFieldEvaluator,
  stringSetRPEFieldEvaluator,
  rpeLightweight,
  sortStringArrayRPEResponseProcessor,
  traverseRPEResponseProcessor,
} from '@gettoor/core';
import { consoleRPEListeners } from '../console/index.js';
import { readFile, writeInsightsToFile } from '../io/index.js';
import { readRPEDatasetFromFile } from '@gettoor/core/rpe-io';

const dirname = path.dirname(new URL(import.meta.url).pathname);

async function run(): Promise<void> {
  const trainingDataset = readRPEDatasetFromFile(
    path.join(dirname, 'job-offers.training.yml'),
    'yaml',
  );
  const validationDataset = readRPEDatasetFromFile(
    path.join(dirname, 'job-offers.validation.yml'),
    'yaml',
  );
  const testDataset = readRPEDatasetFromFile(
    path.join(dirname, 'job-offers.test.yml'),
    'yaml',
  );
 
  const structuredOutputSchema = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the software job offer, ' +
          'e.g. "Backend Software Engineer", "Senior Frontend Engineer", "Full Stack Developer"',
      },
      seniority: {
        type: 'string',
        description: 'The seniority level of the software job offer, ' +
          'e.g. "senior", "mid", "junior"',
      },
      role: {
        type: 'string',
        description: 'The role of the software job offer, ' +
          'e.g. "backend", "frontend", "fullstack"',
      },
      requiredSkills: {
        type: 'array',
        items: {
          type: 'string',
          description: 'A required skill for the software job offer, ' +
            'e.g. "Node.js", "PostgreSQL", "REST APIs"',
        },
        description: 'The required skills for the software job offer, ' +
          'e.g. ["Node.js", "PostgreSQL", "REST APIs"]',
      },
      preferredSkills: {
        type: 'array',
        items: {
          type: 'string',
          description: 'A preferred skill for the software job offer, ' +
            'e.g. "GraphQL", "Docker"',
        },
        description: 'The preferred skills for the software job offer, ' +
          'e.g. ["GraphQL", "Docker"]',
      },
    },
    additionalProperties: false,
    required: ['title', 'seniority', 'role', 'requiredSkills', 'preferredSkills'],
  } satisfies JSONSchema7;

  const seedPrompt = await readFile(
    dirname,
    'job-offers-seed-prompt.md',
  );
  const seedInputs = await readFile(
    dirname,
    'job-offers-seed-inputs.md',
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
    'job-offers-additional-context.md',
  );

  const responseProcessor = traverseRPEResponseProcessor({
    onArray: sortStringArrayRPEResponseProcessor(),
  })

  const evaluator = perFieldRPEEvaluator({
    evaluators: {
      title: exactStringRPEFieldEvaluator(),
      seniority: exactStringRPEFieldEvaluator({
        valueMapping: (valueRaw) => {
          return valueRaw.toLowerCase();
        },
      }),
      role: exactStringRPEFieldEvaluator({
        valueMapping: (valueRaw) => {
          const value = valueRaw.toLowerCase();
          const mapping: Record<string, string> = {
            'full stack': 'fullstack',
          };
          return mapping[value] ?? value;
        },
      }),
      requiredSkills: stringSetRPEFieldEvaluator({}),
      preferredSkills: stringSetRPEFieldEvaluator({}),
    },
  });

  const input: RPEInput = await rpeLightweight({
    seed: [seedCandidate],
    trainingDataset: trainingDataset,
    validationDataset: validationDataset,
    testDataset: testDataset,
    additionalContext,
    responseProcessor,
    modelName: 'gemini:gemini-3.5-flash-lite',
    // modelName: 'openai:gpt-5-nano',
    // modelName: 'openai:gpt-6-luna',
    modelParameters: {
      // temperature: 0.3,
    },
    structuredOutputSchema,
    minScore: 1.0,
    evaluator,
  });
  input.listeners = consoleRPEListeners();

  const { insights } = await optimize(input);
  await writeInsightsToFile(insights, 'job-offers');
}

run().catch(console.error);
