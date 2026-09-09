import { RPEState } from '../rpe-state/index.js';
import { RPEStopFunc } from './rpe-stop-types.js';
import { MinimumScoreRPEStopInput } from './minimum-score-rpe-stop-types.js';

/**
 * Function to determine if the RPE should stop based on a minimum score.
 * The RPE process will stop if any of the aggregated evaluations have
 * an aggregated score greater than or equal to the minimum score
 * set in the input.
 * @category Reflective Prompt Evolution
 * @param input - Input for the minimum score RPE stop function.
 * @returns Function to determine if the RPE should stop.
 */
export function minimumScoreRPEStop(
  input: MinimumScoreRPEStopInput,
): RPEStopFunc {
  const defaultStopReason =
    `Minimum score of ${input.score.toFixed(2)} reached`;
  const { stopReason = defaultStopReason } = input;

  return async (state: RPEState) => {
    const { iteration } = state;
    const evaluations = iteration.aggregatedEvaluations ?? [];

    const hasCandidate = evaluations.some(evaluation => {
      return evaluation.aggregatedScore >= input.score;
    });

    if (hasCandidate) {
      return {
        stop: true,
        stopReason,
      };
    }
    return {
      stop: false,
    }
  };
}