/**
 * Input for the maximum iterations RPE stop function.
 * @category Reflective Prompt Evolution
 */
export interface MaximumIterationsRPEStopInput {
  /**
   * The maximum number of iterations to stop the RPE.
   */
  maxIterations: number;

  /**
   * The reason to stop the RPE. Default used if not provided.
   */
  stopReason?: string;
}