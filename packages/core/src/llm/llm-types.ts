import {
  LanguageModel,
  EmbeddingModel as AiEmbeddingModel,
  type FlexibleSchema,
  type InferSchema,
  generateText,
} from 'ai';

/**
 * AI SDK provider options.
 */
type AiProviderOptions = Parameters<typeof generateText>[0]['providerOptions'];

/**
 * Usage information for a specific model.
 * @category LLM
 */
export interface LLMModelUsage {
  /**
   * The model name.
   */
  modelName: string;

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
 * Usage information for a language model.
 * @category LLM
 */
export interface LLMUsage {
  modelUsage: LLMModelUsage[];
}

/**
 * Result for a single metric.
 * @category LLM
 */
export interface MetricResult {
  /**
   * Score normalized to 0..1.
   */
  normalizedScore: number;

  /**
   * Reasoning for the metric score.
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

  /**
   * Maximum number of retries.
   */
  maxRetries?: number;

  /**
   * Timeout in milliseconds. 
   */
  timeoutMs?: number;

  /**
   * Map the model parameters to a new set of parameters.
   */
  map?: (parameters: ModelParameters) => ModelParameters;
}

/**
 * A language model.
 * @category LLM
 */
export interface LLMModel {
  /**
   * Model name.
   */
  name: string;

  /**
   * AI SDK language model.
   */
  model: LanguageModel;

  /**
   * Provider options to use.
   */
  structuredOutputProviderOptions?: AiProviderOptions;
}

/**
 * An embedding model.
 * @category LLM
 */
export interface EmbeddingModel {
  /**
   * Model name.
   */
  name: string;

  /**
   * AI SDK embedding model.
   */
  model: AiEmbeddingModel;
}

/**
 * Input for generating text input from a language model.
 * @category LLM
 */
export type LLMGenerateTextInput = {
  /**
   * Language model to use.
   */
  model: LLMModel;
  
  /**
   * Model parameters to use.
   */
  modelParameters?: ModelParameters;

  /**
   * Prompt to use.
   */
  prompt: string;
}

/**
 * Output for generating text input from a language model.
 * @category LLM
 */
export type LLMGenerateTextInputOutput = {
  /**
   * Output from the language model.
   */
  output: string;
  
  /**
   * Usage information for the language model.
   */
  usage: LLMUsage;
}

/**
 * Input for generating structured output from a language model.
 * @category LLM
 */
export type LLMGenerateStructuredOutputInput<
  T extends FlexibleSchema = FlexibleSchema
> = {
  /**
   * Language model to use.
   */
  model: LLMModel;

  /**
   * Model parameters to use.
   */
  modelParameters?: ModelParameters;

  /**
   * Prompt to use.
   */
  prompt: string;

  /**
   * Schema to use for structured output.
   */
  schema: T;
}

/**
 * Output for generating structured output from a language model.
 * @category LLM
 */
export type LLMGenerateStructuredOutputOutput<
  T extends FlexibleSchema = FlexibleSchema
> = {
  /**
   * Output from the language model.
   */
  output: InferSchema<T>;

  /**
   * Usage information for the language model.
   */
  usage: LLMUsage;
}