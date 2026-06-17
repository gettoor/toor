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
  const evalPrompt = `
You are a strict evaluator.

Your task is to assess how well the RESPONSE satisfies the PROMPT using the provided SCORING_SCALE.

PROMPT:
<<prompt>>

RESPONSE:
<<response>>

SCORING_SCALE:
<<scoring_scale>>

Evaluation Guidelines:

Assess the response in 2 strict steps.

# Step 1 — Response Format Validation

The RESPONSE must be exactly one of the following values:

- positive
- neutral
- negative

If the RESPONSE is anything else (including different capitalization, additional text, punctuation, whitespace, explanations, or multiple values), immediately return score 1 and stop the evaluation. Do not proceed to Step 2.

# Step 2 — Prompt Satisfaction

Only if the RESPONSE passed Step 1, evaluate how well the RESPONSE satisfies the PROMPT according to the SCORING_SCALE.

Return only the final score.
`;

  const results = await runExperiment({
    settings: {
      evaluator: scalarEvaluator({
        scoringScale: SCALAR_SCORING_1_5,
        evalPrompt,
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

