import { runParallelBatchesOrThrow } from '../concurrency/index.js';
import { RPEAggregator, RPEAggregatorOutput } from './rpe-aggregator/index.js';
import { DEFAULT_AGGREGATOR_PARALLELISM } from './aggregator-consts.js';
import { EvaluatorPromptOutput } from './evaluator-types.js';

export async function aggregateEvaluations(
  evaluations: EvaluatorPromptOutput[],
  aggregator: RPEAggregator,
  parallelism?: number,
): Promise<RPEAggregatorOutput[]> {
  parallelism = parallelism ?? DEFAULT_AGGREGATOR_PARALLELISM;
  const outputs: RPEAggregatorOutput[] = [];

  // tasks
  const tasks = evaluations.map(async evaluation => {
    const output = await aggregator({
      prompt: evaluation.prompt,
      evaluations: evaluation.evaluations,
    });
    outputs.push(output);
  });

  // run tasks in parallel
  await runParallelBatchesOrThrow(tasks, parallelism);
  return outputs;
}