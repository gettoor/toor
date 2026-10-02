export interface ExactStringRPEFieldEvaluatorInput {
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