import { DistributionRange } from '../../math/index.js';
import { LLMUsage, MetricResult } from '../../llm/index.js';
import { RPEPrompt, RPEPromptRef } from '../rpe-prompt/index.js';
import { RPEEvaluatorOutput } from '../rpe-evaluator/index.js';

/**
 * Input for the RPE aggregator.
 * @category Reflective Prompt Evolution
 */
export interface RPEAggregatorInput {
  /**
   * Prompt that was evaluated.
   */
  prompt: RPEPrompt;

  /**
   * Evaluations for the prompt.
   */
  evaluations: RPEEvaluatorOutput[];
}

/**
 * Output for the RPE aggregator.
 * @category Reflective Prompt Evolution
 */
export interface RPEAggregatorOutput {
  /**
   * Reference to the prompt that was evaluated.
   */
  promptRef: RPEPromptRef;

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
 * An aggregator which takes a set of evaluations of a single prompt
 * and aggregates them into a single evaluation.
 * @category Reflective Prompt Evolution
 */
export type RPEAggregator = (
  input: RPEAggregatorInput,
) => Promise<RPEAggregatorOutput>;