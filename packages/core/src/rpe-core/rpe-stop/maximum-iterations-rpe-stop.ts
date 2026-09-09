import { RPEState } from '../rpe-state/index.js';
import { RPEStopFunc } from './rpe-stop-types.js';
import {
  MaximumIterationsRPEStopInput,
} from './maximum-iterations-rpe-types.js';

/**
 * Function to determine if the RPE should stop based on a maximum number of
 * iterations. The RPE process will stop if the number of iterations is greater
 * than or equal to the maximum number of iterations set in the input.
 * @category Reflective Prompt Evolution
 * @param input - Input for the maximum iterations RPE stop function.
 * @returns Function to determine if the RPE should stop.
 */
export function maximumIterationsRPEStop(
  input: MaximumIterationsRPEStopInput,
): RPEStopFunc {
  const defaultStopReason =
    `Maximum iterations of ${input.maxIterations} reached`;
  const { stopReason = defaultStopReason } = input;

  return async (state: RPEState) => {
    const { iterationHistory } = state;
    const iterations = iterationHistory.length;
    if (iterations >= input.maxIterations) {
      return {
        stop: true,
        stopReason,
      };
    }
    return {
      stop: false,
    };
  };
}