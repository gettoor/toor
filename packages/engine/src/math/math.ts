/**
 * Calculates the average of an array of numbers.
 * @category Math
 * @param values - The array of numbers to calculate the average of.
 * @returns The average of the numbers.
 */
export function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

/**
 * Calculates the median of an array of numbers.
 * @category Math
 * @param values - The array of numbers to calculate the median of.
 * @returns The median of the numbers.
 */
export function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = values.sort((a, b) => a - b);
  if (sorted.length % 2 === 0) {
    return (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  }
  return sorted[Math.floor(sorted.length / 2)];
}