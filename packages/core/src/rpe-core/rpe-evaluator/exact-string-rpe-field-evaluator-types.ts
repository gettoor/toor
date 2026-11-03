import { PerFieldRPEEvaluatorField } from './per-field-rpe-evaluator-types.js';
import {
  PerFieldRPEEvaluatorValueMapping,
} from './per-field-rpe-evaluator-value-mapping-types.js';

/**
 * Input for the exact string RPE field evaluator.
 * @category Reflective Prompt Evolution
 */
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
   * Reasoning for the match. The reasoning must contain the field name
   * (e.g. The value in field ${field} matches the expected value.)
   * @param field Fully qualified field name.
   * @param value Value in the field.
   * @param expectedValue Expected value.
   * @param caseSensitive Whether the case sensitivity is considered.
   * @returns Reasoning for the match.
   */
  matchReasoning?: (
    field: PerFieldRPEEvaluatorField,
    value: string,
    expectedValue: string,
    caseSensitive: boolean,
  ) => string;

  /**
   * Reasoning for the match for metrics. The reasoning must contain the
   * field name.
   * @param field Fully qualified field name.
   * @param value Value in the field.
   * @param expectedValue Expected value.
   * @param caseSensitive Whether the case sensitivity is considered.
   * @returns Reasoning for the match for metrics.
   * @default matchReasoning
   */
  matchReasoningForMetrics?: (
    field: PerFieldRPEEvaluatorField,
    value: string,
    expectedValue: string,
    caseSensitive: boolean,
  ) => string;

  /**
   * Reasoning for the mismatch.
   * @param field Fully qualified field name.
   * @param value Value in the field.
   * @param expectedValue Expected value.
   * @param caseSensitive Whether the case sensitivity is considered.
   * @returns Reasoning for the mismatch.
   */
  mismatchReasoning?: (
    field: PerFieldRPEEvaluatorField,
    value: string,
    expectedValue: string,
    caseSensitive: boolean,
  ) => string;

  /**
   * Reasoning for the mismatch for metrics. The reasoning must contain the
   * field name.
   * @param field Fully qualified field name.
   * @param value Value in the field.
   * @param expectedValue Expected value.
   * @param caseSensitive Whether the case sensitivity is considered.
   * @returns Reasoning for the mismatch for metrics.
   * @default mismatchReasoning
   */
  mismatchReasoningForMetrics?: (
    field: PerFieldRPEEvaluatorField,
    value: string,
    expectedValue: string,
    caseSensitive: boolean,
  ) => string;
}