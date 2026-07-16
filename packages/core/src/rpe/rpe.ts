import { RPEInput, RPEState } from './rpe-types.js';
import { generateResponses } from './executor.js';
import { evaluateResponses } from './evaluator.js';

/**
 * Runs the Reflective Prompt Evolution (RPE) process.
 * @param input - Input for the RPE process.
 * @returns A promise that resolves when the RPE process is complete.
 * @category Reflective Prompt Evolution
 */
export async function optimize(
  input: RPEInput,
): Promise<void> {
  const state: RPEState = {
    prompts: input.seed,
    iteration: 0,
  };
  
  while (true) {
    const { outputs: responses } = await generateResponses(
      state.prompts,
      input.trainingDataset,
      input.executor,
    );
    console.log(JSON.stringify(responses, null, 2));

    await evaluateResponses(responses);

    // should stop?
    const shouldStop = await input.stopFunc(state);
    if (shouldStop) {
      break;
    }

    state.iteration++;
  }
}

async function evaluatePrompts(): Promise<void> {

}