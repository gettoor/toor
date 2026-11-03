import { MetricResult } from '../../llm/llm-types.js';
import {
  PerFieldRPEEvaluatorField,
} from './per-field-rpe-evaluator-types.js';
import {
  PerFieldRPEEvaluatorValueMapping,
} from './per-field-rpe-evaluator-value-mapping-types.js';

/**
 * Response and expected response values comparison for the string set RPE
 * field evaluator.
 * @category Reflective Prompt Evolution
 */
export interface StringSetRPEFieldEvaluatorInputValuesComparison {
  /**
   * Response values.
   */
  values: Set<string>;

  /**
   * Expected response values.
   */
  expectedValues: Set<string>;

  /**
   * Values that are present in the response and the expected response.
   */
  commonValues: Set<string>;

  /**
   * Values that are present in the expected response but not in the response.
   */
  missingValues: Set<string>;

  /**
   * Values that are present in the response but not in the expected response.
   */
  extraValues: Set<string>;
}

/**
 * Input for the string set RPE field evaluator.
 * @category Reflective Prompt Evolution
 */
export interface StringSetRPEFieldEvaluatorInput {
  /**
   * Mapping of response values. Values of the expected response are not mapped.
   */
  valueMapping?: PerFieldRPEEvaluatorValueMapping<string>;

  /**
   * Reasoning for the evaluation. The reasoning must contain the field name
   * (e.g. The values in field ${field} match the expected values.)
   * @param field Fully qualified field name.
   * @param comparison Values comparison.
   * @returns Reasoning for the evaluation.
   */
  reasoning?: (
    field: PerFieldRPEEvaluatorField,
    comparison: StringSetRPEFieldEvaluatorInputValuesComparison,
  ) => string;

  /**
   * Function to calculate score.
   * @param field Fully qualified field name.
   * @param comparison Values comparison.
   * @returns Score.
   */
  score?: (
    field: PerFieldRPEEvaluatorField,
    comparison: StringSetRPEFieldEvaluatorInputValuesComparison,
  ) => number;

  /**
   * Function to calculate metrics. The metrics must contain the field name
   * (e.g. ${field}_precision, ${field}_recall, ${field}_f1).
   * @param field Fully qualified field name.
   * @param comparison Values comparison.
   * @returns Metrics.
   */
  metrics?: (
    field: PerFieldRPEEvaluatorField,
    comparison: StringSetRPEFieldEvaluatorInputValuesComparison,
  ) => Record<string, MetricResult>;
}