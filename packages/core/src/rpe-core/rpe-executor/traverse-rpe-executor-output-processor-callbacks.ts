import {
  TraverseRPEExecutorOutputProcessorInput,
} from './traverse-rpe-executor-output-processor-types.js';

/**
 * Sort a string array. Returns the original array if it is not a string array.
 * @param array - Array to sort.
 * @returns Sorted array.
 */
export function sortStringArrayTraverseRPEExecutorOutputCallback(
  sortFunction?: (a: string, b: string) => number,
):
  NonNullable<TraverseRPEExecutorOutputProcessorInput['onResponseArray']>
{
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