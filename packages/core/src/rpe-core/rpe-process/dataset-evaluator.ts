import { RPEState } from '../rpe-state/index.js';
import { generateResponses } from './executor.js';
import { evaluateCandidateResponses } from './evaluator.js';
import { aggregateEvaluations } from './aggregator.js';
import { RPEInput } from './rpe-types.js';
import {
  EvaluateDatasetInput,
  EvaluateDatasetOutput,
} from './dataset-evaluator-types.js';
import { DEFAULT_AGGREGATOR_PARALLELISM } from './aggregator-consts.js';
import { DEFAULT_EVALUATOR_PARALLELISM } from './evaluator-consts.js';

/**
 * Evaluates a dataset. Note that the executor should generate responses for
 * the entries in the dataset.
 * @category Reflective Prompt Evolution
 * @param state - State of the RPE process.
 * @param input - Input for evaluating a dataset.
 * @returns Output for evaluating a dataset.
 */
export async function evaluateDataset(
  state: RPEState,
  input: EvaluateDatasetInput,
): Promise<EvaluateDatasetOutput> {
  // generate responses
  const { responses } = await generateResponses(
    state,
    input.candidates,
    input.executor,
  );

  // evaluate responses
  const { evaluations } = await evaluateCandidateResponses(
    state,
    responses,
    input.evaluator,
    input.evaluatorParallelism,
  );

  // aggregate evaluations
  const aggregatedEvaluations = await aggregateEvaluations(
    state,
    evaluations,
    input.aggregator,
    input.aggregatorParallelism,
  );

  return {
    responses,
    evaluations,
    aggregatedEvaluations,
  };
}

/**
 * Builds input for evaluating a dataset.
 * @see {@link evaluateDataset}
 * @param input - Input for the RPE process.
 * @returns Input for evaluating a dataset.
 */
export function buildInputForDatasetEvaluation(
  input: RPEInput,
): Omit<EvaluateDatasetInput, 'candidates'> {
  return {
    executor: input.candidateExecutor,
    evaluatorParallelism:
      input.candidateEvaluatorParallelism ??
      DEFAULT_EVALUATOR_PARALLELISM,
    evaluator: input.candidateEvaluator,
    aggregatorParallelism:
      input.candidateAggregatorParallelism ??
      DEFAULT_AGGREGATOR_PARALLELISM,
    aggregator: input.candidateAggregator ?? input.aggregator,
  };
}