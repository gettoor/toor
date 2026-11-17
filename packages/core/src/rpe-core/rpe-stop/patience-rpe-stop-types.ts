/**
 * Input for the patience RPE stop function.
 * @category Reflective Prompt Evolution
 */
export interface PatienceRPEStopInput {
  /**
   * Number of iterations without improvement after which the RPE process
   * should stop. An iteration does not improve when no generated candidate
   * is selected, or when the best selected score does not increase by
   * {@link minScoreImprovement}.
   */
  noImprovementCount: number;

  /**
   * Minimum score improvement required not consider as no improvement.
   */
  minScoreImprovement: number;
}
