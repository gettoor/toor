import { RPEInput, RPEState } from './rpe-types.js';
import { generateResponses } from './executor.js';
import { evaluateResponses } from './evaluator.js';
import { aggregateEvaluations } from './aggregator.js';

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
    // generate responses
    const { outputs: responses } = await generateResponses(
      state.prompts,
      input.trainingDataset,
      input.executor,
    );

    // evaluate responses
    const { evaluations } = await evaluateResponses(
      responses,
      input.evaluator,
      input.evaluatorParallelism,
    );
    console.log('------ evaluations ------');
    console.log(JSON.stringify(evaluations, null, 2));

    // aggregate evaluations
    const aggregatedEvaluations = await aggregateEvaluations(
      evaluations,
      input.aggregator,
      input.aggregatorParallelism,
    );
    console.log('------ aggregated evaluations ------');
    console.log(JSON.stringify(aggregatedEvaluations, null, 2));

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