import { calculateSetComparisonCounts } from "./set-comparison-counts.js";

export function calculateF1<T>(
  expected: ReadonlySet<T>,
  predicted: ReadonlySet<T>,
): number {
  if (predicted.size === 0) {
    return expected.size === 0 ? 1 : 0;
  }

  const { tp, fp, fn } = calculateSetComparisonCounts(expected, predicted);
  return (2 * tp) / (2 * tp + fp + fn);
}