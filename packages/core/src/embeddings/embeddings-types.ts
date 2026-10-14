import { ModelProvider } from '../model-provider/index.js';

/**
 * Input parameters for embedding many values.
 * @category Embeddings
 */
export interface EmbedManyInput {
  /**
   * Model provider. If not provided, the default model provider will be used.
   */
  modelProvider?: ModelProvider;

  /**
   * Model name.
   */
  modelName: string;

  /**
   * Values to embed.
   */
  values: string[];

  /**
   * Batch size. If not provided, the default batch size will be used.
   * @default {@link EMBEDDINGS_DEFAULT_BATCH_SIZE}
   */
  batchSize?: number;
}

/**
 * Output of embedding many values.
 * @category Embeddings
 */
export interface EmbedManyOutput {
  /**
   * Embeddings.
   */
  embeddings: number[][];
}