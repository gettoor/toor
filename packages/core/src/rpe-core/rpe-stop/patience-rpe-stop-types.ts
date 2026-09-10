/**
 * Input for the patience RPE stop function.
 * @category Reflective Prompt Evolution
 */
export interface PatienceRPEStopInput {
  /**
   * Number of iterations without best score improvement after which
   * the RPE process should stop.
   */
  noImprovementCount: number;

  /**
   * Minimum score improvement required not consider as no improvement.
   */
  minScoreImprovement: number;
}
