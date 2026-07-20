import { ParallelResult, ParallelSuccessResult } from './parallel-types.js';

/**
 * Runs a list of tasks in parallel, in batches.
 * @category Concurrency
 * @param tasks - Tasks to run in parallel, in batches.
 * @param batchSize - Size of batches to run.
 * @returns Results of the tasks.
 */
export async function runParallelBatches<T>(
  tasks: Promise<T>[],
  batchSize: number,
): Promise<ParallelResult<T>[]> {
  const results: ParallelResult<T>[] = [];
  for (let index = 0; index < tasks.length; index += batchSize) {
    const batch = tasks.slice(index, index + batchSize);
    const batchResults = await Promise.allSettled(batch);
    results.push(
      ...batchResults.map(result => {
        return result.status === 'fulfilled'
          ? { result: result.value }
          : { error: result.reason };
      }),
    );
  }
  return results;
}

/**
 * Runs a list of tasks in parallel, in batches,
 * and throws an error if any of the tasks fails.
 * @category Concurrency
 * @param tasks - Tasks to run in parallel, in batches.
 * @param batchSize - Size of batches to run.
 * @returns Results of the tasks.
 */
export async function runParallelBatchesOrThrow<T>(
  tasks: Promise<T>[],
  batchSize: number,
): Promise<T[]> {
  const results: T[] = [];
  for (let index = 0; index < tasks.length; index += batchSize) {
    const batch = tasks.slice(index, index + batchSize);
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
  }
  return results;
}