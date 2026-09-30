import { RPEDatasetEntry } from '../../rpe-core/index.js';
import {
  RPEDatasetValidatorDuplicate,
} from './rpe-dataset-validator-types.js';
import { isDuplicate } from './rpe-dataset-validator-utils.js';

export function findExactDuplicates(
  entries: RPEDatasetEntry[],
): RPEDatasetValidatorDuplicate[] {
  const duplicates: RPEDatasetValidatorDuplicate[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entryA = entries[i];

    for (let j = i + 1; j < entries.length; j++) {
      const entryB = entries[j];
      if (isDuplicate(entryA, entryB)) {
        duplicates.push({
          datasetEntryIdA: entryA.datasetEntryId,
          datasetEntryIdB: entryB.datasetEntryId,
          similarity: 1,
        });
      }
    }
  }
  return duplicates;
}

