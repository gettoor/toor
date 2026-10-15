import { binary, BinaryOutput } from '@gettoor/core';
import { Styles } from '@gettoor/core/console';

function printResult(result: BinaryOutput): void {
  const resultStr = result.result
    ? Styles.success('Passed')
    : Styles.error('Failed');
  console.log(
    `   ${Styles.muted('Result:')} ${resultStr}\n` +
    `${Styles.muted('Reasoning:')} ${result.reasoning}`
  );
}

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
{{prompt}}

RESPONSE:
{{response}}
`,
  });
  printResult(result);
}

basic().catch(console.error);