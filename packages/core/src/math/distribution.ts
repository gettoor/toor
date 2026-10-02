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

/**
 * Calculate the normalized Shannon entropy of a distribution.
 * @category Math
 * @param counts - Counts of the values.
 * @returns Normalized Shannon entropy.
 */
export function calculateNormalizedShannonEntropy(
  counts: number[],
): number {
  const total = counts.reduce((sum, count) => sum + count, 0);
  const k = counts.length;

  if (total === 0 || k <= 1) {
    return 0;
  }

  const entropy = counts.reduce((sum, count) => {
    if (count === 0) {
      return sum;
    }

    const p = count / total;
    return sum - p * Math.log(p);
  }, 0);

  return entropy / Math.log(k);
}
