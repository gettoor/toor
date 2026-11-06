import { RPEResponseArrayProcessor } from './rpe-response-types.js';

/**
 * Sort a string array. Returns the original array if it is not a string array.
 * @category Reflective Prompt Evolution
 * @param sortFunction - Function to use for sorting the array.
 * @returns Sorted array.
 */
export function sortStringArrayRPEResponseProcessor(
  sortFunction?: (a: string, b: string) => number,
): RPEResponseArrayProcessor {
  return async (array: unknown[]): Promise<unknown[]> => {
    const isStringArray = array.every(item => typeof item === 'string');
    if (!isStringArray) {
      return array;
    }
    const defaultSortFunction = (a: string, b: string) => a.localeCompare(b);
    const sortedArray = array.sort(sortFunction || defaultSortFunction);
    return sortedArray;
  };
}