import { 
  runExperiment,
  ExperimentResult,
  SCALAR_SCORING_1_5,
  scalarEvaluator,
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

async function basic(): Promise<void> {
  const results = await runExperiment({
    settings: {
      evaluator: scalarEvaluator({
        scoringScale: SCALAR_SCORING_1_5,
      }),
      modelName: 'openai:gpt-4o',
    },
    models: [
      {
        name: 'openai:gpt-4o-mini'
      },
    ],
    modelParameters: [
      {
        name: 'default',
        temperature: 0.2,
      },
    ],
    prompts: [
      {
        name: 'sentiment',
        prompt: `
Classify the sentiment of the review.

Review:
<<review>>

Return one of:
- positive
- neutral
- negative
`,
      },
      {
        name: 'review',
        prompt: `
Read the review and tell me what you think.

Review:
<<review>>
`,
      }
    ],
    dataset: [
      {
        name: 'positive-review',
        vars: { review: 'The product exceeded my expectations.' }
      },
      {
        name: 'neutral-review',
        vars: { review: `It's okay, nothing special.` }
      },
      {
        name: 'negative-review',
        vars: { review: `Completely unusable after one day.` }
      },
    ],
  });
  printResults(results);
}

basic().catch(console.error);

