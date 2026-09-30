import {
  RPEDatasetEntryWithName,
  RPEDatasetValidatorSplitLeak,
} from './rpe-dataset-validator-types.js';
import {
  calculateSimilarity,
  findDatasetNameByDatasetEntryId,
} from './rpe-dataset-validator-utils.js';

export function findNearSplitLeaks(
  entries: RPEDatasetEntryWithName[],
  embeddings: Record<string, number[]>,
  nearDuplicateThreshold: number, 
  exactSplitLeaks: RPEDatasetValidatorSplitLeak[],
): RPEDatasetValidatorSplitLeak[] {
  const leaks: RPEDatasetValidatorSplitLeak[] = [];
  const datasetEntryIds = Object.keys(embeddings);

  for (let indexA = 0; indexA < datasetEntryIds.length; indexA++) {
    const entryIdA = datasetEntryIds[indexA];
    const embeddingA = embeddings[entryIdA];
    const datasetNameA = findDatasetNameByDatasetEntryId(entries, entryIdA);

    for (let indexB = indexA + 1; indexB < datasetEntryIds.length; indexB++) {
      const entryIdB = datasetEntryIds[indexB];
      const embeddingB = embeddings[entryIdB];
      const datasetNameB = findDatasetNameByDatasetEntryId(entries, entryIdB);

      const similarity = calculateSimilarity(embeddingA, embeddingB);
      if (
        similarity >= nearDuplicateThreshold &&
        datasetNameA !== datasetNameB &&
        !isExactSplitLeak(entryIdA, entryIdB, exactSplitLeaks)
      ) {
        leaks.push({
          datasetEntryIdA: entryIdA,
          datasetNameA,
          datasetEntryIdB: entryIdB,
          datasetNameB,
          similarity,
        });
      }
    }
  }

  return leaks;
}

function isExactSplitLeak(
  entryIdA: string,
  entryIdB: string,
  exactSplitLeaks: RPEDatasetValidatorSplitLeak[],
): boolean {
  return exactSplitLeaks.some(leak =>
    leak.datasetEntryIdA === entryIdA &&
    leak.datasetEntryIdB === entryIdB,
  );
}