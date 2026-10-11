import {
  PerFieldRPEEvaluatorValueMapping,
} from './per-field-rpe-evaluator-value-mapping-types.js';

export interface ExactStringRPEFieldEvaluatorInput {
  /**
   * Mapping of response values.
   */
  valueMapping?: PerFieldRPEEvaluatorValueMapping<string>;

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