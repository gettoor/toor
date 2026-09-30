import {
  RPEDatasetEntryWithName,
  RPEDatasetValidatorSplitLeak,
} from './rpe-dataset-validator-types.js';
import { isDuplicate } from './rpe-dataset-validator-utils.js';

export function findExactSplitLeaks(
  entries: RPEDatasetEntryWithName[],
): RPEDatasetValidatorSplitLeak[] {
  const leaks: RPEDatasetValidatorSplitLeak[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entryA = entries[i];
    const datasetNameA = entryA.datasetName;

    for (let j = i + 1; j < entries.length; j++) {
      const entryB = entries[j];
      const datasetNameB = entryB.datasetName;
      if (datasetNameA !== datasetNameB && isDuplicate(entryA, entryB)) {
        leaks.push({
          datasetEntryIdA: entryA.datasetEntryId,
          datasetNameA,
          datasetEntryIdB: entryB.datasetEntryId,
          datasetNameB,
          similarity: 1,
        });
      }
    }
  }  
  return leaks;
}

