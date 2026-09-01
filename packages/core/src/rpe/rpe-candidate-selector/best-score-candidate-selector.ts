import { RPEState } from '../rpe-state/index.js';
import {
  RPECandidateSelector,
  RPECandidateSelectorInfo,
  RPECandidateSelectorInput,
  RPECandidateSelectorOutput,
} from './rpe-candidate-selector-types.js';
import {
  BestScoreCandidateSelectorInput,
} from './best-score-candidate-selector-types.js';

/**
 * Selects all the candidates with the highest aggregated score.
 * @category Reflective Prompt Evolution
 * @param input - Input for the candidate selector.
 * @returns Selected candidates.
 */
export function bestScoreCandidateSelector(
  input: BestScoreCandidateSelectorInput,
): RPECandidateSelector {
  const { newCandidatesOnly = false } = input;

  return {
    run: async (
      state: RPEState,
      input: RPECandidateSelectorInput,
    ): Promise<RPECandidateSelectorOutput> => {
      const allAggregatedEvaluations = [
        ...state.iteration.candidateAggregatedEvaluations ?? [],
      ];
      if (!newCandidatesOnly) {
        allAggregatedEvaluations.push(
          ...state.iteration.aggregatedEvaluations ?? [],
        );
      }

      // find the max score
      const maxScore = Math.max(
        ...allAggregatedEvaluations.map(aggregatedEvaluation => {
          return aggregatedEvaluation.aggregatedScore;
        }),
        0,
      );

      // find the candidates with the max score
      const maxScorePromptRefs = allAggregatedEvaluations
        .filter(aggregatedEvaluation => {
          return aggregatedEvaluation.aggregatedScore === maxScore;
        })
        .map(aggregatedEvaluation => {
          return aggregatedEvaluation.candidateRef;
        });

      return {
        candidateRefs: maxScorePromptRefs,
      }
    },

    getInfo: async (): Promise<RPECandidateSelectorInfo> => {
      return {
        name: 'Best Score Candidate Selector',
        properties: [
          {
            key: 'newCandidatesOnly',
            value: newCandidatesOnly,
            description: 'Whether to only consider new candidates.',
          },
        ],
      };
    },
  };
}