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

/**
 * Result for a single metric.
 * @category LLM
 */
export interface MetricResult {
  /**
   * The score for the metric.
   */
  score: number;

  /**
   * The reasoning for the metric score.
   */
  reasoning?: string;
}