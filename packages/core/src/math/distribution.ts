import { DistributionRange } from './distribution-types.js';

/**
 * Distribute scores into ranges.
 * @category Math
 * @param scores - Scores to distribute.
 * @param ranges - Ranges to distribute the scores into.
 * @returns Distribution of the scores.
 */
export function distributeScores(
  scores: number[],
  ranges: DistributionRange[],
): DistributionRange[] {
  const max = ranges[ranges.length - 1].max;
  for (const score of scores) {
    for (const range of ranges) {
      if (score >= max) {
        ranges[ranges.length - 1].count++;
        break;
      }
      if (score >= range.min && score < range.max) {
        range.count++;
        break;
      }
    }
  }

  return ranges;
}