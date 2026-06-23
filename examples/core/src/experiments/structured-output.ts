import { 
  DefaultModelProvider,
  ExperimentResult,
  SCALAR_SCORING_1_5,
  scalarEvaluator,
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

async function basic(): Promise<void> {
  const results = await runExperiment({
    settings: {
      evaluator: scalarEvaluator({
        scoringScale: SCALAR_SCORING_1_5,
        modelName: 'openai:gpt-4o',
      }),
    },

    // models to evaluate
    models: [
      {
        name: 'gemini:gemini-2.5-flash'
      },
    ],
    modelProvider: new DefaultModelProvider(),

    // model parameters to evaluate
    modelParameters: [
      {
        name: 'default',
        temperature: 0.2,
      },
    ],

    // prompts to evaluate
    prompts: [
      {
        name: 'classifier',
        prompt: `
Classify the support ticket.

Return structured output with:
- priority: "low" | "medium" | "high"
- category: "bug" | "billing" | "feature" | "question"

Ticket:
<<ticket>>
`,
      },
    ],

    // structured output to evaluate
    structuredOutput: {
      format: 'yaml',
      schema: {
        type: 'object',
        properties: {
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
          },
          category: {
            type: 'string',
            enum: ['bug', 'billing', 'feature', 'question'],
          },
        },
        required: ['priority', 'category'],
      },
    },

    // dataset with variables to replace in the prompts
    dataset: [
      {
        name: 'charged-twice',
        vars: { ticket: 'I was charged twice for my subscription this month.' }
      },
      {
        name: 'dark-mode',
        vars: { ticket: 'Can you add dark mode to the dashboard?' }
      },
    ],
  });

  printResults(results);
}

basic().catch(console.error);

