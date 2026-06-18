import { 
  binaryEvaluator,
  ExperimentResult,
  runExperiment,
} from '@gettoor/core';
import { table } from '../console.js';

function printResults(results: ExperimentResult[]): void {
  table(
    ['Model', 'Parameters', 'Prompt', 'Dataset', 'Score'],
    results.map((result) => [
      result.modelName,
      result.parametersName,
      result.promptName,
      result.datasetName,
      result.score.scoreAsString,
    ])
  );
}

async function datasetVariables(): Promise<void> {
  const results = await runExperiment({
    settings: {
      evaluator: binaryEvaluator({
        modelName: 'openai:gpt-4o',
      }),
    },
    models: [
      // models to evaluate
      { name: 'openai:gpt-4o-mini' },
    ],
    modelParameters: [
      // model parameters to evaluate
      { name: 'default', temperature: 0.2 },
    ],
    prompts: [
      {
        // prompts to evaluate
        name: 'support',
        prompt: `
Determine whether the candidate is a good match for the job.

<<input:yaml>>

Respond with exactly one of:
match
no_match
`
      },
    ],

    // dataset with variables to replace in the prompts
    dataset: [
      { 
        name: 'match',
        vars: {
          input: {
            job_description: 'Senior TypeScript engineer with NestJS experience.',
            candidate_profile: '10 years of TypeScript experience, 5 years with NestJS.',
          },
        },
      },
      { 
        name: 'no-match',
        vars: {
          input: {
            job_description: 'Senior TypeScript engineer with NestJS experience.',
            candidate_profile: 'Graphic designer with 8 years of Adobe Photoshop experience.',
          },
        },
      },
    ],
  });

  printResults(results);
}

datasetVariables().catch(console.error);

