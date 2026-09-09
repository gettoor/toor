/**
 * Function to aggregate values.
 * @category Math
 * @param values - Values to aggregate.
 * @returns Aggregated value.
 */
export type AggregationFunc<T = number> = (values: T[]) => T;