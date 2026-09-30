/**
 * Function to aggregate values.
 * @category Math
 * @param values - Values to aggregate.
 * @returns Aggregated value.
 */
export type AggregationFunc<TInput = number, TOutput = number> = (
  values: TInput[],
) => TOutput;