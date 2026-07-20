/**
 * A successful result from a parallel task.
 * @category Concurrency
 */
export type ParallelSuccessResult<T> = {
  /**
   * The result of the task.
   */
  result: T;
}

/**
 * A failure result from a parallel task.
 * @category Concurrency
 */
export type ParallelFailureResult = {
  /**
   * The error that occurred if the task failed.
   */
  error: Error;
}

/**
 * A result from a parallel task.
 * @category Concurrency
 * @template T - The type of the result.
 */
export type ParallelResult<T> =
  | ParallelSuccessResult<T>
  | ParallelFailureResult;
