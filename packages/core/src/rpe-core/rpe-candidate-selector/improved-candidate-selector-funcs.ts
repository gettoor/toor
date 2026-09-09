import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';

/**
 * Check if a candidate is improved by using the aggregated score.
 * @category Reflective Prompt Evolution
 * @param newEvaluation - New aggregated evaluation.
 * @param parentEvaluation - Previous aggregated evaluation.
 * @returns True if the candidate is improved, false otherwise.
 */
export function isCandidateImprovedByScore(
  newEvaluation: RPEAggregatorOutput,
  parentEvaluation: RPEAggregatorOutput,
) {
  return newEvaluation.aggregatedScore > parentEvaluation.aggregatedScore;
}