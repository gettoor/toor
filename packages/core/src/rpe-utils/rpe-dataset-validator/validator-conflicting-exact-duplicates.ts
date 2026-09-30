import { deepEqual } from '../../lang/index.js';
import { InternalToorError, ToorError } from '../../errors/index.js';
import { RPEDatasetEntry } from '../../rpe-core/index.js';
import {
  RPEDatasetValidatorDuplicate,
  RPEDatasetValidatorConflictingExactDuplicate,
} from './rpe-dataset-validator-types.js';

export function findConflictingExactDuplicates(
  entries: RPEDatasetEntry[],
  exactDuplicates: RPEDatasetValidatorDuplicate[],
): RPEDatasetValidatorConflictingExactDuplicate[] {
  const duplicates: RPEDatasetValidatorConflictingExactDuplicate[] = [];

  const findEntry = (datasetEntryId: string) => {
    const entry = entries.find(entry => {
      return entry.datasetEntryId === datasetEntryId;
    });
    if (!entry) {
      throw new InternalToorError(
        `Dataset entry of identifier ` +
        `${ToorError.quote(datasetEntryId)} not found`
      );
    }
    return entry;
  };

  // find exact duplicates with different expected responses
  exactDuplicates.forEach(exactDuplicate => {
    const entryA = findEntry(exactDuplicate.datasetEntryIdA);
    const entryB = findEntry(exactDuplicate.datasetEntryIdB);

    const equalExpectedResponse = deepEqual(
      entryA.expectedResponse,
      entryB.expectedResponse,
    );
    if (!equalExpectedResponse) {
      duplicates.push({
        datasetEntryIdA: exactDuplicate.datasetEntryIdA,
        datasetEntryIdB: exactDuplicate.datasetEntryIdB,
      });
    }
  });

  return duplicates;
}
