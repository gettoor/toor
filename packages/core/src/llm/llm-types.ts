/**
 * Usage information for a language model.
 * @category LLM
 */
export interface LLMUsage {
  /**
   * Number of input tokens used.
   */
  inputTokens?: number;

  /**
   * Number of output tokens used.
   */
  outputTokens?: number;
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

/**
 * Model parameters for the LLM-as-a-judge.
 * @category LLM
 */
export interface ModelParameters {
  /**
   * Maximum number of tokens the model may generate in its response.
   *
   * Lower values limit response length and cost, while higher values
   * allow longer and more detailed outputs.
   */
  maxOutputTokens?: number;

  /**
   * Controls sampling randomness.
   *
   * Lower values make outputs more deterministic and focused, while
   * higher values increase creativity and variation.
   */
  temperature?: number;

  /**
   * Controls nucleus sampling.
   *
   * The model considers the smallest set of tokens whose cumulative
   * probability is at least `topP` and samples from that set.
   * Lower values make outputs more focused and deterministic,
   * while higher values increase diversity.
   */
  topP?: number;

  /**
   * Controls top-k sampling.
   *
   * The model samples only from the `topK` most likely next tokens.
   * Lower values produce more predictable outputs, while higher
   * values allow for more varied and creative responses.
   */
  topK?: number;

  /**
   * Penalizes tokens that have already appeared in the generated text.
   *
   * Higher values encourage the model to introduce new topics and
   * vocabulary instead of repeating previously used tokens.
   */
  presencePenalty?: number;

  /**
   * Penalizes tokens based on how frequently they have already appeared
   * in the generated text.
   *
   * Higher values reduce repetition of the same words and phrases,
   * resulting in more varied output.
   */
  frequencyPenalty?: number;
}