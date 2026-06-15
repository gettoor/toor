import { dim, green, red } from '../console.js';
import { binary, BinaryOutput } from '@gettoor/core';

function printResult(result: BinaryOutput): void {
  console.log(
    `   ${dim('Result:')} ${result.result ? green('Passed') : red('Failed')}\n` +
    `${dim('Reasoning:')} ${result.reasoning}`
  );
}``

async function basic(): Promise<void> {
  const result = await binary({
    modelName: 'openai:gpt-4o',
    prompt: 'What is the capital of France?',
    response: 'Paris',
  });
  printResult(result);
}

async function customPrompt(): Promise<void> {
  const result = await binary({
    modelName: 'openai:gpt-4o',
    prompt: 'What is the capital of France?',
    response: 'Paris',
    evalPrompt: `
You are an evaluator. Does the response correctly satisfy the prompt?

PROMPT:
<<prompt>>

RESPONSE:
<<response>>
`,
  });
  printResult(result);
}

basic().catch(console.error);