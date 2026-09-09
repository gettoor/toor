import { LLMUsage } from '../../llm/index.js';
import { RPEProperties } from '../rpe-info/index.js';
import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';
import { RPECandidateRef } from '../rpe-candidate/index.js';
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
 * Analysis of a failed example (dataset entry).
 * @category Reflective Prompt Evolution
 */
export interface RPEAnalyzerFailedExampleAnalysis {
  /**
   * Identifier of the dataset entry.
   */
  datasetEntryId: string;

  /**
   * Response from the model.
   */
  response: string;

  /**
   * What went wrong, not why.
   */
  failureReason: string;

  /**
   * Why the current prompt plausibly led the model to that failure.
   */
  plausibleCause: string;

  /**
   * Concept the prompt fails to distinguish correctly.
   */
  missingConceptualDistinction: string;

  /**
   * Rule that could fix other similar examples.
   */
  generalRule: string;

  /**
   * Already-successful behaviors or examples that could become worse if generalRule is applied too broadly.
   */
  regressionRisks: string[];
}

/**
 * Output for the RPE analyzer.
 * @category Reflective Prompt Evolution
 */
export interface RPEAnalyzerOutput {
  /**
   * Reference to the candidate for which the analysis is performed.
   */
  candidateRef: RPECandidateRef;

  /**
   * Strengths of the candidate.
   */
  strengths: string[];

  /**
   * Analysis of each failed example.
   */
  failedExampleAnalysis: RPEAnalyzerFailedExampleAnalysis[];

  /**
   * Recommendations for the candidate improvement.
   */
  recommendations: string[];

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
 * and failure patterns for the candidate improvement.
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