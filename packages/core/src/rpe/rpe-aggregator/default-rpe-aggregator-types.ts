import { z } from 'zod';

/**
 * Input for the default RPE aggregator.
 * @category Reflective Prompt Evolution
 */
export interface DefaultRPEAggregatorInput {
  /**
   * Function to aggregate the scores of the evaluations.
   * @see {@link average}
   * @see {@link median}
   */
  aggregationFunc: (values: number[]) => number;

  /**
   * Threshold for the passed evaluations. If the score of an evaluation is
   * greater than or equal to this threshold, the evaluation is considered
   * passed.
   */
  passedEvaluationThreshold: number;
}
