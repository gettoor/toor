import { AggregationFunc } from '../../index.js';
import { PerFieldRPEEvaluatorFieldEvaluator } from '../index.js';

export interface ArrayRPEFieldEvaluatorInput<T = any> {
  /**
   * Evaluator for each item in the array.
   */
  itemEvaluator: PerFieldRPEEvaluatorFieldEvaluator<T>;

  /**
   * Function to aggregate the scores of the item evaluators.
   * Defaults to the average of the scores.
   */
  scoreAggregator?: AggregationFunc;

  /**
   * Function to aggregate the reasonings of the item evaluators.
   * If not provided, the reasonings will be concatenated each prefixed with
   * the array index and separated by a newline.
   */
  reasoningAggregator?: AggregationFunc<string, string>;

  /**
   * Function to sort the items in the array.
   * If not provided, then no sort is performed.
   */
  sort?: (a: T, b: T) => number;
}