import { RPECandidate } from '../rpe-candidate/index.js';
import {
  RPEExecutor,
  RPEExecutorOutputProcessor,
  RPEExecutorResponse,
} from '../rpe-executor/index.js';
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
   * Output processor to process the outputs of the executor.
   */
  executorOutputProcessor: RPEExecutorOutputProcessor;

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

  /**
   * Called when responses are being generated.
   */
  generatingResponses?: () => Promise<void>;

  /**
   * Called when responses have been generated.
   * @param responses - Responses generated.
   */
  responsesGenerated?: (
    responses: RPEExecutorResponse[],
  ) => Promise<void>;

  /**
   * Called when responses are being evaluated.
   */
  evaluatingResponses?: () => Promise<void>;

  /**
   * Called when evaluations have been evaluated.
   */
  responsesEvaluated?: (
    evaluations: EvaluatorCandidateOutput[],
  ) => Promise<void>;

  /**
   * Called when evaluations are being aggregated.
   */
  aggregatedEvaluations?: () => Promise<void>;

  /**
   * Called when evaluations have been aggregated.
   */
  evaluationsAggregated?: (
    aggregatedEvaluations: RPEAggregatorOutput[],
  ) => Promise<void>;
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