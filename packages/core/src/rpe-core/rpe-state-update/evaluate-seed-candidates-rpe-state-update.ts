import { RPEState, RPEUpdateStateFunc } from '../rpe-state/index.js';
import {
  RPEInput,
  buildInputForDatasetEvaluation,
  evaluateDataset,
} from '../rpe-process/index.js';

/**
 * Evaluate the seed candidates. This function is to be called at the beginning
 * of the RPE process.
 * @category Reflective Prompt Evolution
 * @param input - The input of the RPE process.
 * @returns A function to update the state of the RPE process.
 */
export function evaluateSeedCandidatesRPEStateUpdate(
  input: RPEInput,
): RPEUpdateStateFunc {
  return async (state: RPEState) => {
    const {
      aggregatedEvaluations: seedAggregatedEvaluations,
    } = await evaluateDataset(
      state,
      {
        candidates: input.seed,
        ...buildInputForDatasetEvaluation(input),
      },
    );
    state.aggregatedEvaluations.push(...seedAggregatedEvaluations);    
  };
}