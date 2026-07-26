import { RPEState } from '../rpe-state/index.js';

/**
 * Output for the stop function when the RPE should continue.
 * @category Reflective Prompt Evolution
 */
export interface RPEStopOutputFalse {
  stop: false;
}

/**
 * Output for the stop function when the RPE should stop.
 * @category Reflective Prompt Evolution
 */
export interface RPEStopOutputTrue {
  stop: true;
  stopReason: string;
}

/**
 * Output for the stop function.
 * @category Reflective Prompt Evolution
 */
export type RPEStopOutput = RPEStopOutputFalse | RPEStopOutputTrue;

/**
 * Function to determine if the RPE should stop.
 * @category Reflective Prompt Evolution
 */
export type RPEStopFunc = (state: RPEState) => Promise<RPEStopOutput>;