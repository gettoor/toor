/**
 * Checks if the two sets of items are exactly the same.
 * @param expected - Expected set of items.
 * @param predicted - Eredicted set of items.
 * @returns True if the two sets of items are exactly the same, false otherwise.
 */
export function isExactMatch<T>(
  expected: ReadonlySet<T>,
  predicted: ReadonlySet<T>,
): boolean {
  return expected.size === predicted.size &&
    Array.from(expected).every((item) => predicted.has(item));
}

/**
 * Calculates the exact match score of a set of items.
 * @param expected - Expected set of items.
 * @param predicted - Eredicted set of items.
 * @returns Exact match score of the set of items.
 * 1 if the two sets of items are exactly the same, 0 otherwise.
 */
export function calculateExactMatchScore<T>(
  expected: ReadonlySet<T>,
  predicted: ReadonlySet<T>,
): number {
  return isExactMatch(expected, predicted) ? 1 : 0;
}