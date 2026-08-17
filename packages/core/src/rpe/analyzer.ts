import { runParallelBatchesOrThrow } from '../concurrency/index.js';
import { RPEState } from './rpe-state/index.js';
import { DEFAULT_ANALYZER_PARALLELISM } from './analyzer-consts.js';
import { RPEAggregatorOutput } from './rpe-aggregator/index.js';
import { 
  RPEAnalyzer,
  RPEAnalyzerOutput,
} from './rpe-analyzer/rpe-analyzer-types.js';

export async function analyzeAggregatedEvaluations(
  state: RPEState,
  aggregatedEvaluations: RPEAggregatorOutput[],
  analyzer: RPEAnalyzer,
  parallelism?: number,
): Promise<RPEAnalyzerOutput[]> {
  parallelism = parallelism ?? DEFAULT_ANALYZER_PARALLELISM;
  const outputs: RPEAnalyzerOutput[] = [];

  // tasks
  const tasks = aggregatedEvaluations.map(async aggregatedEvaluation => {
    const output = await analyzer(
      state,
      {
        aggregation: aggregatedEvaluation,
      },
    );
    outputs.push(output);
  });

  // run tasks in parallel
  await runParallelBatchesOrThrow(tasks, parallelism);

  return outputs;
}