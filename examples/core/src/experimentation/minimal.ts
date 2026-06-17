import { 
  runExperiment,
  SCALAR_SCORING_1_5,
  scalarEvaluator,
} from '@gettoor/core';

async function minimal(): Promise<void> {
  const results = await runExperiment({
    settings: {
      modelName: 'openai:gpt-4o',
      evaluator: scalarEvaluator({
        scoringScale: SCALAR_SCORING_1_5,
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
        prompt: 'Answer clearly: <<question>>' },
      ],

      // dataset with variables to replace in the prompts
      dataset: [
        { 
          name: 'reset-password',
          vars: {
            question: 'How can I reset my password?',
          },
        },
      ],
  });

  // score of the first combination of model, parameters, prompt and dataset
  console.log('Score: ' + results[0].score.scoreAsString);
}

minimal().catch(console.error);

