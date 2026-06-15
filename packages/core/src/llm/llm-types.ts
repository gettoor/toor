/**
 * Usage information for a language model.
 * @category LLM
 */
export interface LLMUsage {
  /**
   * Number of input tokens used.
   */
  inputTokens: number | undefined;

  /**
   * Number of output tokens used.
   */
  outputTokens: number | undefined;
}