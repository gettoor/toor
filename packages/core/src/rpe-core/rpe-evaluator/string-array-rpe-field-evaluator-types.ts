import {
  PerFieldRPEEvaluatorValueMapping,
} from './per-field-rpe-evaluator-value-mapping-types.js';

export interface StringArrayRPEFieldEvaluatorInput {
  /**
   * Mapping of response values.
   */
  valueMapping?: PerFieldRPEEvaluatorValueMapping<string>;

  /**
   * Function to compare two strings. Default to exact string comparison.
   */
  compare?: (a: string, b: string) => boolean;

  /**
   * Function to sort the strings before comparison. Default to no sorting.
   * If the response and expected value are sorted, then evaluator effectively
   * becomes a set of strings evaluator.
   */
  sort?: (strings: string[]) => string[];

  /**
   * Reasoning for when a value in the array matches the expected value.
   */
  matchReasoning?: (value: string, index: number) => string;

  /**
   * Reasoning for when a value in the array matches the expected value after
   * mapping.
   */
  mappedMatchReasoning?: (
    value: string,
    mappedValue: string,
    expectedValue: string,
    index: number,
  ) => string;

  /**
   * Reasoning for when the items in the array do not match the expected value.
   */
  mismatchReasoning?: (
    value: string,
    expectedValue: string,
    index: number,
  ) => string;

  /**
   * Reasoning for when the items in the array are additional to the expected
   * value.
   */
  additionalItemsReasoning?: (items: string[]) => string;

  /**
   * Reasoning for when the items in the array are missing from the expected
   * value.
   */
  missingItemsReasoning?: (items: string[]) => string;

  /**
   * Reasoning for when the items in the array exactly match the expected value.
   */
  overallMatchReasoning?: string;
}