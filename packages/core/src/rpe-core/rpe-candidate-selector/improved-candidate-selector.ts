import { InternalToorError, ToorError } from '../../errors/index.js';
import { RPECandidateRef } from '../rpe-candidate/index.js';
import { RPEState } from '../rpe-state/index.js';
import {
  RPECandidateSelector,
  RPECandidateSelectorInfo,
  RPECandidateSelectorInput,
  RPECandidateSelectorOutput,
} from './rpe-candidate-selector-types.js';
import {
  ImprovedCandidateSelectorInput,
} from './improved-candidate-selector-types.js';

/**
 * Selects the candidates which perform better than the previous iteration.
 * @param input - Input for the candidate selector.
 * @returns Candidate selector.
 */
export function improvedCandidateSelector(
  input: ImprovedCandidateSelectorInput,
): RPECandidateSelector {
  const {
    isCandidateImproved,
    selectParentCandidatesIfBetter = true,
  } = input;

  return {
    run: async (
      state: RPEState,
      input: RPECandidateSelectorInput,
    ): Promise<RPECandidateSelectorOutput> => {
      const parentEvaluations = state.iteration.aggregatedEvaluations ?? [];
      if (!parentEvaluations) {
        throw new InternalToorError(
          'No parent aggregated evaluations in improved candidate selector.'
        );
      }
      const newEvaluations = state.iteration.candidateAggregatedEvaluations;
      if (!newEvaluations) {
        throw new InternalToorError(
          'No new aggregated evaluations in improved candidate selector.'
        );
      }
      
      const findCandidateById = (candidateId: string) => {
        const candidate = state.candidates.find(candidate => {
          return candidate.candidateId === candidateId;
        });
        if (!candidate) {
          throw new InternalToorError(
            `Candidate ${ToorError.quote(candidateId)} ` +
            `not found in improved candidate selector.`
          );
        }
        return candidate;
      };

      const selectedCandidateRefs: RPECandidateRef[] = [];
      // check which candidates are improved
      for (const newEvaluation of newEvaluations)
      {
        const newCandidate = findCandidateById(
          newEvaluation.candidateRef.candidateId,
        );

        // find the parent evaluation for the candidate
        const parentEvaluation = parentEvaluations.find(evaluation => {
          const parentCandidate = findCandidateById(
            evaluation.candidateRef.candidateId,
          );
          return newCandidate.parentCandidateIds?.includes(
            parentCandidate.candidateId,
          );
        });
        if (!parentEvaluation) {
          continue;
        }

        // check if the candidate is improved
        const isImproved = isCandidateImproved(
          newEvaluation,
          parentEvaluation,
        );
        if (isImproved) {
          selectedCandidateRefs.push(newEvaluation.candidateRef);
        }
        if (!isImproved && selectParentCandidatesIfBetter) {
          selectedCandidateRefs.push(parentEvaluation.candidateRef);
        }
      }

      return { candidateRefs: selectedCandidateRefs };
    },

    getInfo: async (): Promise<RPECandidateSelectorInfo> => {
      return {
        name: 'Improved Candidate Selector',
        properties: [
          {
            key: 'selectParentCandidatesIfBetter',
            value: selectParentCandidatesIfBetter,
            description:
              'Indicates if to select parent candidates ' +
              'if they perform better than the new candidates.',
          }
        ],
      };
    },
  };
}