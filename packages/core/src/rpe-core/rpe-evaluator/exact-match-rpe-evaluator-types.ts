/**
 * Input for the exact match RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface ExactMatchRPEEvaluatorInput {
  /**
   * Whether to consider case sensitivity.
   * @default true
   */
  caseSensitive?: boolean;

  /**
   * Reasoning for the match.
   */
  matchReasoning?: string;

  /**
   * Reasoning for the mismatch.
   */
  mismatchReasoning?: string;
}