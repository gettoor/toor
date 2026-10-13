export interface TraverseRPEExecutorOutputProcessorInput {
  /**
   * Callback to execute for each object.
   */
  onResponseObject?: (
    object: Record<string, unknown>,
  ) => Promise<Record<string, unknown>>;

  /**
   * Callback to execute for each array.
   */
  onResponseArray?: (
    array: unknown[],
  ) => Promise<unknown[]>;
}