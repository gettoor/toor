import { 
  toExperimentScore,
  ExperimentResult,
  ExperimentEvaluator,
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

async function customEvaluator(): Promise<void> {
  const evaluator: ExperimentEvaluator = async (input) => {
    const VALID_RESPONSES = ['high', 'medium', 'low'];
    const isValid = VALID_RESPONSES.includes(input.response);
    return {
      score: toExperimentScore({
        score: isValid ? 1 : 0,
        minScore: 0,
        maxScore: 1,
        reasoning: isValid ? 'Valid response' : 'Invalid response',
      }),
    };
  };

  const prompt = `
Determine the priority of the following support ticket.

Priority definitions:

high — Critical issue causing outages, security incidents, data loss, or preventing core functionality.
medium — Significant issue affecting functionality or multiple users, but a workaround may exist.
low — Minor issue, question, cosmetic problem, feature request, or enhancement.

Respond with exactly one of:

high
medium
low

Ticket:

<<ticket>>
`;

  const results = await runExperiment({
    settings: {
      evaluator
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
        prompt,
      },
    ],

    // dataset with variables to replace in the prompts
    dataset: [
      { 
        name: 'production-down',
        vars: {
          ticket: 'Production is down for all customers.',
        },
      },
      { 
        name: 'user-request',
        vars: {
          ticket: 'A user requests a new dashboard feature.',
        },
      },
      { 
        name: 'performance-issue',
        vars: {
          ticket: 'A few users report occasional slow page loads.',
        },
      },
    ],
  });

  printResults(results);
}

customEvaluator().catch(console.error);

