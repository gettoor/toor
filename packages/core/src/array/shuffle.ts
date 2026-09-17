/**
 * Shuffles an array.
 * @category Array
 * @param array - Array to shuffle.
 * @returns Shuffled array.
 */
export function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}