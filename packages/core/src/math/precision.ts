import { calculateSetComparisonCounts } from './set-comparison-counts.js';

/**
 * Calculates the precision of a set of items.
 * @param expected - Expected set of items.
 * @param predicted - Eredicted set of items.
 * @returns Precision of the set of items.
 */
export function calculatePrecision<T>(
  expected: ReadonlySet<T>,
  predicted: ReadonlySet<T>,
): number {
  if (predicted.size === 0) {
    return expected.size === 0 ? 1 : 0;
  }

  // tp + fp = number of predicted items
  const { tp, fp } = calculateSetComparisonCounts(expected, predicted);
  return tp / (tp + fp);
}