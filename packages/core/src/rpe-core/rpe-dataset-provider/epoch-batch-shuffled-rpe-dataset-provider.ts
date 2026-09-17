import { shuffleArray } from '../../array/index.js';
import { RPEDataset, RPEDatasetEntry } from '../rpe-dataset/index.js';
import { RPEDatasetProvider } from './rpe-dataset-provider-types.js';

/**
 * Provider for a shuffled dataset.
 * @category Reflective Prompt Evolution
 * @param dataset - Dataset to shuffle.
 * @param batchSize - Size of the batch to pick from the dataset.
 * @returns Provider for a shuffled dataset.
 */
export function epochBatchShuffledDatasetProvider(
  dataset: RPEDataset,
  batchSize: number,
): RPEDatasetProvider {
  let shuffledEntries = shuffleArray(dataset.entries);
  let entryIndex = 0;

  return async () => {
    const resultEntries: RPEDatasetEntry[] = [];
    let needShuffle = false;

    // pick entries from the shuffled dataset
    for (let index = 0; index < batchSize; index++) {
      resultEntries.push(shuffledEntries[entryIndex]);

      // move to the next entry
      entryIndex++;
      if (entryIndex === shuffledEntries.length) {
        needShuffle = true;
        entryIndex = 0;
      }
    }

    // shuffle the dataset if we have reached the end
    if (needShuffle) {
      shuffledEntries = shuffleArray(dataset.entries);
    }

    return { entries: resultEntries };
  };
}
