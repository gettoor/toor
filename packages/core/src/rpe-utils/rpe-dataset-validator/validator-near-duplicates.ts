import {
  RPEDatasetValidatorDuplicate,
} from './rpe-dataset-validator-types.js';
import { calculateSimilarity } from './rpe-dataset-validator-utils.js';

export function findNearDuplicates(
  embeddings: Record<string, number[]>,
  nearDuplicateThreshold: number,
  exactDuplicates: RPEDatasetValidatorDuplicate[],
): RPEDatasetValidatorDuplicate[] {
  const duplicates: RPEDatasetValidatorDuplicate[] = [];
  const datasetEntryIds = Object.keys(embeddings);
  
  for (let i = 0; i < datasetEntryIds.length; i++) {
    const entryIdA = datasetEntryIds[i];
    const embeddingA = embeddings[entryIdA];

    for (let j = i + 1; j < datasetEntryIds.length; j++) {
      const entryIdB = datasetEntryIds[j];
      const embeddingB = embeddings[entryIdB];

      const similarity = calculateSimilarity(embeddingA, embeddingB);
      if (
        similarity >= nearDuplicateThreshold &&
        !isExactDuplicate(entryIdA, entryIdB, exactDuplicates)
      ) {
        duplicates.push({
          datasetEntryIdA: entryIdA,
          datasetEntryIdB: entryIdB,
          similarity,
        });
      }
    }
  }
  return duplicates;
}

function isExactDuplicate(
  entryIdA: string,
  entryIdB: string,
  exactDuplicates: RPEDatasetValidatorDuplicate[],
): boolean {
  return exactDuplicates.some(duplicate =>
    duplicate.datasetEntryIdA === entryIdA &&
    duplicate.datasetEntryIdB === entryIdB,
  );
}