import { 
  SCALAR_SCORING_1_3,
  SCALAR_METRIC_CORRECTNESS,
  SCALAR_METRIC_COMPLETENESS,
  SCALAR_METRIC_RELEVANCE,
  SCALAR_METRIC_GRAMMAR,
  SCALAR_METRIC_HELPFULNESS,
  SCALAR_METRIC_SAFETY,
  ScalarOutput,
  ScalarScoringScale,
  scalar,
} from '@gettoor/core';
import { dim } from '../console.js';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function printResult(result: ScalarOutput): void {
  console.log(
    `   ${dim('Result:')} ${result.result.score}\n` +
    `${dim('Reasoning:')} ${result.reasoning}`
  );

  const metricNames = Object.keys(result.result.metrics).sort();
  if (metricNames.length > 0) {
    console.log(`  ${dim('Metrics:')}`);
    for (const name of metricNames) {
      console.log(
        `     ${dim(capitalize(name))}: ${result.result.metrics[name].score}` +
        ` ${dim('·')} ${result.result.metrics[name].reasoning}`
      );
    }
  }
}

async function basic(): Promise<void> {
  const result = await scalar({
    modelName: 'openai:gpt-4o',
    prompt: 'Summarize the benefits of regular exercise.',
    response: [
      'Regular exercise improves cardiovascular health, ',
      'helps maintain a healthy weight, ',
      'strengthens muscles and bones, ',
      'improves mood, ',
      'and reduces the risk of many chronic diseases.',
    ].join(''),
  });
  printResult(result);
}

async function customScale(): Promise<void> {
  const scoringScale: ScalarScoringScale = {
    min: 0,
    max: 1,
    prompt: `
      0 = Incorrect or irrelevant
      1 = Correct
    `,
  };
  const result = await scalar({
    modelName: 'openai:gpt-4o',
    prompt: 'What is the capital of France?',
    response: 'Paris',
    scoringScale,
  });
  printResult(result);
}

async function metrics(): Promise<void> {
  const result = await scalar({
    modelName: 'openai:gpt-4o',
    prompt: 'Summarize the benefits of regular exercise.',
    metrics: [
      SCALAR_METRIC_CORRECTNESS,
      SCALAR_METRIC_COMPLETENESS,
      SCALAR_METRIC_RELEVANCE,
    ],
    response: [
      'Regular exercise improves cardiovascular health, ',
      'helps maintain a healthy weight, ',
      'strengthens muscles and bones, ',
      'improves mood, ',
      'and reduces the risk of many chronic diseases.',
    ].join(''),
  });
  printResult(result);
}

async function customPrompt(): Promise<void> {
  const result = await scalar({
    modelName: 'openai:gpt-4o',
    prompt: 'What is the capital of France?',
    response: 'Paris is the capital of France.',
    scoringScale: SCALAR_SCORING_1_3,
    metrics: [
      SCALAR_METRIC_GRAMMAR,
      SCALAR_METRIC_HELPFULNESS,
      SCALAR_METRIC_SAFETY,
    ],
    evalPrompt: `
You are an evaluator. Does the response correctly satisfy the prompt?

PROMPT:
<<prompt>>

RESPONSE:
<<response>>

SCORING_SCALE Scale:
<<scoring_scale>>

METRICS:
<<metrics>>
`,
  });
  printResult(result);
}

customPrompt().catch(console.error);