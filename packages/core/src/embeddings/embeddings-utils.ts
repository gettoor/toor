import { embedMany as aiEmbedMany } from 'ai';

import { DefaultModelProvider } from '../model-provider/index.js';
import { EMBEDDINGS_DEFAULT_BATCH_SIZE } from './embeddings-consts.js';
import { EmbedManyInput, EmbedManyOutput } from './embeddings-types.js';

/**
 * Embeds many values.
 * @category Embeddings
 * @param input - Input parameters.
 * @returns Result embeddings.
 */
export async function embedMany(
  input: EmbedManyInput,
): Promise<EmbedManyOutput> {
  const {
    modelProvider = new DefaultModelProvider(),
    modelName,
    values,
    batchSize = EMBEDDINGS_DEFAULT_BATCH_SIZE,
  } = input;

  const model = await modelProvider.getEmbeddingModel(modelName);
  const embeddings: number[][] = [];

  for (let index = 0; index < values.length; index += batchSize) {
    const batch = values.slice(index, index + batchSize);
    const { embeddings: batchEmbeddings } = await aiEmbedMany({
      model: model.model,
      values: batch,
    });
    embeddings.push(...batchEmbeddings);
  }

  return { embeddings };
}