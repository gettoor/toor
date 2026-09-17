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
      // const parentEvaluations =
      //   state.iteration.trainingAggregatedEvaluations ?? [];
      // if (!parentEvaluations) {
      //   throw new InternalToorError(
      //     'No parent aggregated evaluations in improved candidate selector.'
      //   );
      // }
      // const newEvaluations = state.iteration.candidateAggregatedEvaluations;
      // if (!newEvaluations) {
      //   throw new InternalToorError(
      //     'No new aggregated evaluations in improved candidate selector.'
      //   );
      // }
      
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

      const findAggregatedEvaluationById = (candidateId: string) => {
        const aggregatedEvaluation = state.aggregatedEvaluations
          .find(evaluation => {
            return evaluation.candidateRef.candidateId === candidateId;
          });
        if (!aggregatedEvaluation) {
          throw new InternalToorError(
            `Evaluation for candidate ${ToorError.quote(candidateId)} ` +
            `not found in improved candidate selector.`
          );
        }
        return aggregatedEvaluation;
      };

      const selectedCandidateRefs: RPECandidateRef[] = [];
      // check which candidates are improved
      for (const { candidateRef } of state.iteration.generatedCandidates ?? []) {
        const generatedCandidate = findCandidateById(candidateRef.candidateId);
        if (!generatedCandidate.parentCandidateIds) {
          throw new InternalToorError(
            `Candidate ${ToorError.quote(candidateRef.candidateId)} ` +
            `has no parent candidates in improved candidate selector.`
          );
        }
        // TODO: handle multiple parent candidates
        const parentCandidateId = generatedCandidate.parentCandidateIds[0];

        // find the aggregated evaluations
        const generatedCandidateEvaluation = findAggregatedEvaluationById(
          candidateRef.candidateId,
        );
        const parentCandidateEvaluation = findAggregatedEvaluationById(
          parentCandidateId,
        );

        // check if the candidate is improved
        const isImproved = isCandidateImproved(
          generatedCandidateEvaluation,
          parentCandidateEvaluation,
        );
        if (isImproved) {
          selectedCandidateRefs.push(generatedCandidateEvaluation.candidateRef);
        }
        if (!isImproved && selectParentCandidatesIfBetter) {
          selectedCandidateRefs.push(parentCandidateEvaluation.candidateRef);
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
              'Compares the new candidates to the parent candidates ' +
              'and selects the better ones.',
          }
        ],
      };
    },
  };
}