/**
 * Input for the minimum score RPE stop function.
 * @category Reflective Prompt Evolution
 */
export interface MinimumScoreRPEStopInput {
  /**
   * The minimum score to stop the RPE.
   */
  score: number;

  /**
   * The reason to stop the RPE. Default used if not provided.
   */
  stopReason?: string;
}