/**
 * A mapping of values.
 * @category Reflective Prompt Evolution
 */
export type PerFieldRPEEvaluatorValueMapping<T> =
  | Record<string, T>
  | ((value: T) => T);

/**
 * Output of a value mapping.
 */
export interface PerFieldRPEEvaluatorValueMappingOutput {
  /**
   * Mapped value or original value if no mapping was provided.
   */
  value: string;

  /**
   * Whether the value was mapped.
   */
  isMapped: boolean;
}