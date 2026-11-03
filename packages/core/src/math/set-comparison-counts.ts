import { SetComparisonCounts } from "./set-comparison-counts-types.js";

export function calculateSetComparisonCounts<T>(
  expected: ReadonlySet<T>,
  predicted: ReadonlySet<T>
): SetComparisonCounts {
  const tp = calculateTruePositives(expected, predicted);
  const fp = calculateFalsePositives(expected, predicted);
  const fn = calculateFalseNegatives(expected, predicted);
  return { tp, fp, fn };
}

// true positives: items that are expected and predicted
function calculateTruePositives<T>(
  expected: ReadonlySet<T>,
  predicted: ReadonlySet<T>,
): number {
  return [...predicted].filter((item) => expected.has(item)).length;
}

// false positives: items that are predicted but not expected
function calculateFalsePositives<T>(
  expected: ReadonlySet<T>,
  predicted: ReadonlySet<T>,
): number {
  return [...predicted].filter((item) => !expected.has(item)).length;
}

// false negatives: items that are expected but not predicted
function calculateFalseNegatives<T>(
  expected: ReadonlySet<T>,
  predicted: ReadonlySet<T>,
): number {
  return [...expected].filter((item) => !predicted.has(item)).length;
}