import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';

/**
 * Check if a candidate is improved.
 * @category Reflective Prompt Evolution
 * @param newCandidateAggregatedEvaluation - New aggregated evaluation.
 * @param parentCandidateAggregatedEvaluation - Parent aggregated evaluation.
 * @returns True if the candidate is improved, false otherwise.
 */
export type ImprovedCandidateSelectorIsImprovedFunc = (
  newCandidateAggregatedEvaluation: RPEAggregatorOutput,
  parentCandidateAggregatedEvaluation: RPEAggregatorOutput,
) => boolean;

/**
 * Input for the improved candidate selector.
 * @category Reflective Prompt Evolution
 */
export interface ImprovedCandidateSelectorInput {
  /**
   * Function to check if a candidate is improved.
   * @see {@link isCandidateImprovedByScore}
   */
  isCandidateImproved: ImprovedCandidateSelectorIsImprovedFunc;

  /**
   * Indicates if to select previous candidates if they perform better than
   * the new candidates. Defaults to true.
   */
  selectParentCandidatesIfBetter?: boolean;
}