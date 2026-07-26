import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';
import { RPEPrompt } from '../rpe-prompt/index.js';

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
   * Prompt for which the analysis is performed.
   */
  prompt: RPEPrompt;

  /**
   * Strengths of the prompt.
   */
  strengths: string[];

  /**
   * Weaknesses of the prompt.
   */
  weaknesses: string[];

  /**
   * Recommendations for the prompt improvement.
   */
  recommendations: string[];

  /**
   * Failure patterns of the prompt.
   */
  failurePatterns: string[];
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