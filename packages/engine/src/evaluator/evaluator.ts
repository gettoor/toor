import { EvaluationInput, EvaluationOutput } from './evaluator-types.js';

/**
 * Evaluates a dataset entry using an evaluator.
 * @param input - The input for the evaluator.
 * @returns The output of the evaluator.
 */
export async function evaluate<
  TDatasetEntry,
  TEvaluatorResult,
  TFinalScore,
>(
  input: EvaluationInput<TDatasetEntry, TEvaluatorResult, TFinalScore>,
): Promise<EvaluationOutput<TEvaluatorResult, TFinalScore>> {
  const outputs: TEvaluatorResult[] = [];

  // evaluate each dataset entry
  for (let index = 0; index < input.dataset.length; index++) {
    const datasetEntry = input.dataset[index];

    // call the callback function to notify that the evaluator has started
    if (input.onEvaluatorStart) {
      await input.onEvaluatorStart(datasetEntry, index);
    }

    // evaluate the dataset entry
    const output = await input.evaluator(datasetEntry, index);
    outputs.push(output);

    // call the callback function to notify that the evaluator has ended
    if (input.onEvaluatorEnd) {
      await input.onEvaluatorEnd(datasetEntry, index, output);
    }
  }

  // calculate the final score
  const score = await input.score(outputs);
  
  return { outputs, score };
}
