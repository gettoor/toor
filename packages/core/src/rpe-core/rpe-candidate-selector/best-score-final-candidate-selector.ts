import {
  candidateRefFromCandidate,
  deduplicateCandidates,
} from '../rpe-candidate/rpe-candidate-utils.js';
import { RPEState } from '../rpe-state/rpe-state-types.js';
import { findCandidateById } from '../rpe-state/rpe-state-utils.js';
import { RPECandidateSelectorInput } from './rpe-candidate-selector-types.js';
import { RPECandidateSelectorOutput } from './rpe-candidate-selector-types.js';
import {
  RPECandidateSelector,
  RPECandidateSelectorInfo,
} from './rpe-candidate-selector-types.js';

/**
 * Select the best-score final candidates. It gets the highest score and picks
 * all the candidates with that score.
 * @category Reflective Prompt Evolution
 * @returns A function to select the best-score final candidates.
 */
export function bestScoreFinalCandidateSelector(): RPECandidateSelector {
  return {
    run: async (
      state: RPEState,
      input: RPECandidateSelectorInput,
    ): Promise<RPECandidateSelectorOutput> => {
      // find the maximum aggregated score
      let maxAggregatedScore = -1;
      state.aggregatedEvaluations?.forEach((aggregatedEvaluation) => {
        const aggregatedScore = aggregatedEvaluation?.aggregatedScore ?? 0;
        if (aggregatedScore > maxAggregatedScore) {
          maxAggregatedScore = aggregatedScore;
        }
      });
      console.log('maxAggregatedScore', maxAggregatedScore);

      // find the candidates with the maximum aggregated score
      const candidateRefs = (state.aggregatedEvaluations ?? [])
        .filter(({ aggregatedScore }) => {
          return aggregatedScore === maxAggregatedScore;
        })
        .map(candidate => candidate.candidateRef);
      
      // deduplicate the candidates
      const candidates = candidateRefs.map(candidateRef => {
        return findCandidateById(state, candidateRef.candidateId);
      })
      const deduplicated = deduplicateCandidates(candidates);

      return {
        candidateRefs: deduplicated.map(candidate => {
          return candidateRefFromCandidate(candidate);
        }),
      };
    },

    getInfo: async (): Promise<RPECandidateSelectorInfo> => {
      return {
        name: 'Best-score Final Candidate Selector',
        properties: [],
      };
    },
  };
}