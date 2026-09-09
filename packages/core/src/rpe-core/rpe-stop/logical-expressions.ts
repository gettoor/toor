import { RPEState } from '../rpe-state/index.js';
import { RPEStopFunc } from './rpe-stop-types.js';

/**
 * Combine multiple stop functions into a single stop function that returns true
 * if all of the given stop functions return true.
 * @category Reflective Prompt Evolution
 * @param expressions - Stop functions to combine.
 * @param stopReason - Reason to return if all expressions return true.
 * @returns A single stop function combining the given stop functions.
 */
export function andRPEStop(
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
 * @category Reflective Prompt Evolution
 * @param expressions - Stop functions to combine.
 * @returns A single stop function combining the given stop functions.
 */
export function orRPEStop(
  expressions: RPEStopFunc[],
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
    };
  };
}