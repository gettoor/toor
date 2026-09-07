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
