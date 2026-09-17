import { DuplicateDatasetEntryError } from './rpe-dataset-errors.js';
import { RPEDataset } from './rpe-dataset-types.js';

/**
 * Split a dataset into multiple datasets based on the given ratios.
 * @param dataset - Dataset to split.
 * @param ratios - Ratios to split the dataset into.
 * @returns Split datasets.
 * @category Reflective Prompt Evolution
 */
export function splitRPEDataset(
  dataset: RPEDataset,
  ...ratios: number[]
): RPEDataset[] {
  const totalRatio = ratios.reduce((acc, ratio) => acc + ratio, 0);
  let remainingCount = dataset.entries.length;
  let remainingEntries = [...dataset.entries];

  const datasets: RPEDataset[] = [];
  for (let index = 0; index < ratios.length; index++) {
    const ratio = ratios[index];

    const count = index === ratios.length - 1
      ? remainingCount
      : Math.floor(ratio * remainingCount / totalRatio);
    remainingCount -= count;

    datasets.push({
      entries: remainingEntries.splice(0, count),
    });
  }

  return datasets;
}

/**
 * Merge multiple datasets into a single dataset.
 * @param datasets - Datasets to merge.
 * @returns Merged dataset.
 * @category Reflective Prompt Evolution
 */
export function mergeRPEDatasets(
  ...datasets: RPEDataset[]
): RPEDataset {
  // check for duplicate dataset entries
  const ids = new Set<string>();
  for (const dataset of datasets) {
    for (const entry of dataset.entries) {
      if (ids.has(entry.datasetEntryId)) {
        throw new DuplicateDatasetEntryError(entry.datasetEntryId);
      }
      ids.add(entry.datasetEntryId);
    }
  }

  // merge
  return {
    entries: datasets.flatMap(dataset => dataset.entries),
  };
}