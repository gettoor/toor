import { MetricResult } from '../../llm/index.js';
import { RPEExecutorOutput } from '../rpe-executor/index.js';

/**
 * Input for the RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface RPEEvaluatorInput {
  /**
   * Response with its context to evaluate.
   */
  response: RPEExecutorOutput;
}

/**
 * Output for the RPE evaluator.
 * @category Reflective Prompt Evolution
 */
export interface RPEEvaluatorOutput {
  /**
   * Response with its context to evaluate.
   */
  response: RPEExecutorOutput;

  /**
   * Score normalized to 0..1.
   */
  score: number;

  /**
   * Reasoning of the evaluation. Extremely important for the RPE process.
   * It can vary from a single sentence to a detailed explanation.
   */
  reasoning: string;

  /**
   * Metrics for the evaluation. Metric scores are normalized to 0..1.
   */
  metrics?: Record<string, MetricResult>;
}

/**
 * An evaluator which takes a prompt and produces information passed
 * to a failure analyzer.
 * @category Reflective Prompt Evolution
 */
export type RPEEvaluator = (
  input: RPEEvaluatorInput,
) => Promise<RPEEvaluatorOutput>;