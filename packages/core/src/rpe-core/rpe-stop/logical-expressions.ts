import { RPEState } from '../rpe-state/index.js';
import { RPEStopFunc } from './rpe-stop-types.js';

/**
 * Combine multiple stop functions into a single stop function that returns true
 * if all of the given stop functions return true.
 * @param expressions - The stop functions to combine.
 * @returns A single stop function combining the given stop functions.
 * @category Reflective Prompt Evolution
 */
export function rpeStopAnd(
  expressions: RPEStopFunc[],
  stopReason?: string,
): RPEStopFunc {
  return async (state: RPEState) => {
    for (const expression of expressions) {
      const result = await expression(state);
      if (!result.stop) {
        return { stop: false };
      }
    }
    return { 
      stop: true,
      stopReason: stopReason ?? 'All expressions returned true',
    };
  };
}

/**
 * Combine multiple stop functions into a single stop function that returns true
 * if any of the given stop functions return true.
 * @param expressions - The stop functions to combine.
 * @returns A single stop function combining the given stop functions.
 * @category Reflective Prompt Evolution
 */
export function rpeStopOr(
  expressions: RPEStopFunc[],
  stopReason?: string,
): RPEStopFunc {
  return async (state: RPEState) => {
    for (const expression of expressions) {
      const result = await expression(state);
      if (result.stop) {
        return result;
      }
    }
    return { 
      stop: false,
      stopReason: stopReason ?? 'No expressions returned true',
    };
  };
}