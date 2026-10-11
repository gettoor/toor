import { AggregationFunc } from '../../math/index.js';

/**
 * Output of a field evaluator.
 * @category Reflective Prompt Evolution
 */
export interface PerFieldRPEEvaluatorFieldEvaluatorOutput {
  /** Fully qualified field name. */
  field: string;

  /** Result score for the field evaluation. */
  score: number;

  /** Reasoning for the field evaluation. */
  reasoning: string;
}

/**
 * A field to evaluate.
 * @category Reflective Prompt Evolution
 */
export interface PerFieldRPEEvaluatorField {
  /** Fully qualified field name. */
  field: string;

  /** Array index for the field, if the field is an array. */
  arrayIndex?: number;
}

/**
 * A function that evaluates a field.
 * @category Reflective Prompt Evolution
 */
export type PerFieldRPEEvaluatorFieldEvaluator<T = any> = (
  value: T,
  expectedValue: T | undefined,
  field: PerFieldRPEEvaluatorField,
) => Promise<PerFieldRPEEvaluatorFieldEvaluatorOutput>;

/**
 * Evaluators for a field. A value is either a field evaluator or another
 * evaluators object whose shape matches a nested object or array.
 */
export type PerFieldRPEEvaluatorEvaluators = {
  [field: string]:
    | PerFieldRPEEvaluatorFieldEvaluator
    | PerFieldRPEEvaluatorEvaluators;
}

/**
 * Input for the per-field RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface PerFieldRPEEvaluatorInput {
  /** 
   * Object of field evaluators. The structure of the object (evaluators)
   * corresponds to the structure of the response.
   * */
  evaluators: PerFieldRPEEvaluatorEvaluators;

  /**
   * Function to aggregate the scores of the field evaluators.
   * Defaults to 1 if all scores are 1, otherwise 0.
   */
  scoreAggregator?: AggregationFunc<
    PerFieldRPEEvaluatorFieldEvaluatorOutput,
    number
  >;

  /**
   * Function to aggregate the reasonings of the field evaluators.
   * If not provided, the reasonings will be concatenated each prefixed with
   * the field name and separated by a newline.
   */
  reasoningAggregator?: AggregationFunc<
    PerFieldRPEEvaluatorFieldEvaluatorOutput,
    string
  >;
}
