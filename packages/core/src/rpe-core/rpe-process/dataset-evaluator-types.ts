import { RPECandidate } from '../rpe-candidate/index.js';
import { RPEExecutor, RPEExecutorResponse } from '../rpe-executor/index.js';
import { RPEEvaluator } from '../rpe-evaluator/index.js';
import { RPEAggregatorOutput } from '../rpe-aggregator/index.js';
import { RPEAggregator } from '../rpe-aggregator/index.js';
import { EvaluatorCandidateOutput } from './evaluator-types.js';

/**
 * Input for evaluating a dataset. That is, generating responses for a set of
 * candidates and evaluating them against a dataset. Finally, aggregating the
 * evaluations.
 * @category Reflective Prompt Evolution
 */
export interface EvaluateDatasetInput {
  /**
   * Candidates to evaluate.
   */
  candidates: RPECandidate[];

  /**
   * Executor to use for generating responses.
   */
  executor: RPEExecutor;

  /**
   * Number of concurrent evaluators to use.
   */
  evaluatorParallelism: number;

  /**
   * Evaluator to use for evaluating the responses.
   */
  evaluator: RPEEvaluator;

  /**
   * Number of concurrent aggregators to use.
   */
  aggregatorParallelism: number;

  /**
   * Aggregator to use for aggregating the evaluations.
   */
  aggregator: RPEAggregator;
}

/**
 * Output for evaluating a dataset.
 * @category Reflective Prompt Evolution
 */
export interface EvaluateDatasetOutput {
  /**
   * Responses generated for the candidates.
   */
  responses: RPEExecutorResponse[];

  /**
   * Evaluations of the responses.
   */
  evaluations: EvaluatorCandidateOutput[];

  /**
   * Aggregated evaluations.
   */
  aggregatedEvaluations: RPEAggregatorOutput[];
}