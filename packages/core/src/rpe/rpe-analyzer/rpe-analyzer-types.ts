import { LLMUsage } from '../../llm/index.js';
import { RPEProperties } from '../rpe-info/index.js';
import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';
import { RPEPromptRef } from '../rpe-prompt/index.js';
import { RPEState } from '../rpe-state/index.js';

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
   * Reference to the prompt for which the analysis is performed.
   */
  promptRef: RPEPromptRef;

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

  /**
   * Usage of the model.
   */
  usage?: LLMUsage;
}

/**
 * Info of the RPE analyzer.
 * @category Reflective Prompt Evolution
 */
export interface RPEAnalyzerInfo {
  /**
   * Name of the analyzer.
   */
  name: string;

  /**
   * Properties of the analyzer.
   */
  properties?: RPEProperties;
}

/**
 * An analyzer takes aggregation from evaluations and returns an analysis of
 * the aggregation. It should return strengths, weaknesses, recommendations
 * and summary for the prompt improvement.
 * @category Reflective Prompt Evolution
 */
export interface RPEAnalyzer {
  /**
   * Analyze the aggregation of the evaluations.
   * @param state - State of the RPE process.
   * @param input - Input for the analyzer.
   * @returns Analyzer output.
   */
  run(state: RPEState, input: RPEAnalyzerInput): Promise<RPEAnalyzerOutput>;

  /**
   * Get the info of the analyzer.
   * @returns Info of the analyzer.
   */
  getInfo(): Promise<RPEAnalyzerInfo>;
}