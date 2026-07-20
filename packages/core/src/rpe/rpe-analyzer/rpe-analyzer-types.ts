import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';

/**
 * Input for the RPE analyzer.
 * @category Reflective Prompt Evolution
 */
export interface RPEAnalyzerInput {
  /**
   * Aggregation of the evaluations.
   */
  aggregation: RPEAggregatorOutput;
}

/**
 * Output for the RPE analyzer.
 * @category Reflective Prompt Evolution
 */
export interface RPEAnalyzerOutput {
  /**
   * Analysis of the aggregation.
   */
  analysis: string;
}

/**
 * An analyzer takes aggregation from evaluations and returns an analysis of
 * the aggregation. It should return strengths, weaknesses, recommendations
 * and summary for the prompt improvement.
 * @category Reflective Prompt Evolution
 */
export type RPEAnalyzer = (
  input: RPEAnalyzerInput,
) => Promise<RPEAnalyzerOutput>;