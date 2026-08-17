import { runParallelBatchesOrThrow } from '../concurrency/index.js';
import { findPromptById, RPEState } from './rpe-state/index.js';
import { RPEAggregator, RPEAggregatorOutput } from './rpe-aggregator/index.js';
import { DEFAULT_AGGREGATOR_PARALLELISM } from './aggregator-consts.js';
import { EvaluatorPromptOutput } from './evaluator-types.js';

export async function aggregateEvaluations(
  state: RPEState,
  evaluations: EvaluatorPromptOutput[],
  aggregator: RPEAggregator,
  parallelism?: number,
): Promise<RPEAggregatorOutput[]> {
  parallelism = parallelism ?? DEFAULT_AGGREGATOR_PARALLELISM;
  const outputs: RPEAggregatorOutput[] = [];

  // tasks
  const tasks = evaluations.map(async evaluation => {
    const output = await aggregator({
      prompt: findPromptById(state, evaluation.promptRef.promptId),
      evaluations: evaluation.evaluations,
    });
    outputs.push(output);
  });

  // run tasks in parallel
  await runParallelBatchesOrThrow(tasks, parallelism);
  return outputs;
}