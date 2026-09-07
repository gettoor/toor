import { runParallelBatchesOrThrow } from '../concurrency/index.js';
import { findCandidateById, RPEState } from './rpe-state/index.js';
import { RPEAggregator, RPEAggregatorOutput } from './rpe-aggregator/index.js';
import { DEFAULT_AGGREGATOR_PARALLELISM } from './aggregator-consts.js';
import { EvaluatorCandidateOutput } from './evaluator-types.js';

export async function aggregateEvaluations(
  state: RPEState,
  evaluations: EvaluatorCandidateOutput[],
  aggregator: RPEAggregator,
  parallelism?: number,
): Promise<RPEAggregatorOutput[]> {
  parallelism = parallelism ?? DEFAULT_AGGREGATOR_PARALLELISM;
  const outputs: RPEAggregatorOutput[] = [];

  // tasks
  const tasks = evaluations.map(async evaluation => {
    const output = await aggregator.run({
      candidate: findCandidateById(state, evaluation.candidateRef.candidateId),
      evaluations: evaluation.evaluatorOutputs,
    });
    outputs.push(output);
  });

  // run tasks in parallel
  await runParallelBatchesOrThrow(tasks, parallelism);
  return outputs;
}