
import { calculateSetComparisonCounts } from './set-comparison-counts.js';

/**
 * Calculates the recall of a set of items.
 * @param expected - Expected set of items.
 * @param predicted - Eredicted set of items.
 * @returns Recall of the set of items.
 */
export function calculateRecall<T>(
  expected: ReadonlySet<T>,
  predicted: ReadonlySet<T>,
): number {
  if (expected.size === 0) {
    return predicted.size === 0 ? 1 : 0;
  }

  // tp + fn = number of expected items
  const { tp, fn } = calculateSetComparisonCounts(expected, predicted);
  return tp / (tp + fn);
}
