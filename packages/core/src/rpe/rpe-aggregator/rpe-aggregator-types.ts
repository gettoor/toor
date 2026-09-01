import { DistributionRange } from '../../math/index.js';
import { LLMUsage, MetricResult } from '../../llm/index.js';
import { RPEProperties } from '../rpe-info/index.js';
import { RPECandidate, RPECandidateRef } from '../rpe-candidate/index.js';
import { RPEEvaluatorOutput } from '../rpe-evaluator/index.js';

/**
 * Input for the RPE aggregator.
 * @category Reflective Prompt Evolution
 */
export interface RPEAggregatorInput {
  /**
   * Candidate that was evaluated.
   */
  candidate: RPECandidate;

  /**
   * Evaluations for the candidate.
   */
  evaluations: RPEEvaluatorOutput[];
}

/**
 * Output for the RPE aggregator.
 * @category Reflective Prompt Evolution
 */
export interface RPEAggregatorOutput {
  /**
   * Reference to the candidate that was evaluated.
   */
  candidateRef: RPECandidateRef;

  /**
   * Evaluations that passed.
   */
  passedEvaluations: RPEEvaluatorOutput[];

  /**
   * Evaluations that did not pass.
   */
  failedEvaluations: RPEEvaluatorOutput[];

  /**
   * Aggregated score (normalized to 0..1).
   */
  aggregatedScore: number;

  /**
   * Aggregated metrics for the evaluation.
   * Metric scores are normalized to 0..1.
   */
  aggregatedMetrics?: Record<string, MetricResult>;

  /**
   * Distribution of the scores.
   */
  scoreDistribution: DistributionRange[];

  /**
   * Usage of the model.
   */
  usage?: LLMUsage;
}

/**
 * Info of the RPE aggregator.
 * @category Reflective Prompt Evolution
 */
export interface RPEAggregatorInfo {
  /**
   * Name of the aggregator.
   */
  name: string;

  /**
   * Properties of the aggregator.
   */
  properties?: RPEProperties;
}

/**
 * An aggregator which takes a set of evaluations of a single candidate
 * and aggregates them into a single evaluation.
 * @category Reflective Prompt Evolution
 */
export interface RPEAggregator {
  /**
   * Aggregate evaluations for a candidate.
   * @param input - Input for the aggregator.
   * @returns Aggregated output.
   */
  run(input: RPEAggregatorInput): Promise<RPEAggregatorOutput>;

  /**
   * Get the info of the aggregator.
   * @returns Info of the aggregator.
   */
  getInfo(): Promise<RPEAggregatorInfo>;
}