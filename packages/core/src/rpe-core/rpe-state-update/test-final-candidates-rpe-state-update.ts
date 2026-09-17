import { evaluateDataset } from '../rpe-process/index.js';
import {
  findCandidateById,
  RPEState,
  RPEUpdateStateFunc,
} from '../rpe-state/index.js';
import {
  TestFinalCandidatesRPEStateUpdateInput,
} from './test-final-candidates-rpe-state-update-types.js';

/**
 * Test the final candidates against the test dataset.
 * @category Reflective Prompt Evolution
 * @param input - The input of the RPE process.
 * @returns A function to update the state of the RPE process.
 */
export function testFinalCandidatesRPEStateUpdate(
  input: TestFinalCandidatesRPEStateUpdateInput,
): RPEUpdateStateFunc {
  const { testDataset, ...evaluateDatasetInput } = input;

  return async (state: RPEState) => {
    // get final candidates
    const lastIteration = state.iterationHistory[
      state.iterationHistory.length - 1
    ];
    if (!lastIteration) {
      return;
    }
    const finalCandidates = lastIteration.selectedCandidateRefs.map(
      candidateRef => findCandidateById(state, candidateRef.candidateId),
    );

    // evaluate
    const { aggregatedEvaluations } = await evaluateDataset(
      state,
      {
        candidates: finalCandidates,
        ...evaluateDatasetInput,
      },
    );

    // update state
    aggregatedEvaluations.forEach(aggregatedEvaluation => {
      const { candidateRef } = aggregatedEvaluation;
      let finalCandidate = state.finalCandidates.find(itr => {
        return itr.candidateRef.candidateId === candidateRef.candidateId;
      });
      if (!finalCandidate) {
        finalCandidate = { candidateRef };
        state.finalCandidates.push(finalCandidate);
      }
      finalCandidate.aggregatedEvaluation = aggregatedEvaluation;
    });
  };
}