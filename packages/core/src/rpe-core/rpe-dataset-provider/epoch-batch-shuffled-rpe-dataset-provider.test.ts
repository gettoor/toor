import { shuffleArray } from '../../array/index.js';
import { RPEDataset, RPEDatasetEntry } from '../rpe-dataset/index.js';
import { RPEState } from '../rpe-state/index.js';
import {
  epochBatchShuffledDatasetProvider,
} from './epoch-batch-shuffled-rpe-dataset-provider.js';

jest.mock('../../array/index.js', () => ({
  shuffleArray: jest.fn(),
}));

const mockedShuffleArray = jest.mocked(shuffleArray);

const state = {} as RPEState;

function createDataset(ids: string[]): RPEDataset {
  return {
    entries: ids.map(datasetEntryId => ({ datasetEntryId })),
  };
}

function idsOf(entries: RPEDatasetEntry[]): string[] {
  return entries.map(entry => entry.datasetEntryId);
}

describe('epochBatchShuffledDatasetProvider', () => {
  it('returns a batch of the requested size from the shuffled dataset', async () => {
    const dataset = createDataset(['a', 'b', 'c', 'd']);
    mockedShuffleArray.mockReturnValueOnce([
      dataset.entries[3],
      dataset.entries[1],
      dataset.entries[0],
      dataset.entries[2],
    ]);

    const provider = epochBatchShuffledDatasetProvider(dataset, 2);
    const batch = await provider(state);

    expect(idsOf(batch.entries)).toEqual(['d', 'b']);
    expect(mockedShuffleArray).toHaveBeenCalledTimes(1);
    expect(mockedShuffleArray).toHaveBeenCalledWith(dataset.entries);
  });

  it('serves sequential non-overlapping batches from the same shuffle until the epoch ends', async () => {
    const dataset = createDataset(['a', 'b', 'c', 'd', 'e']);
    mockedShuffleArray.mockReturnValue([
      dataset.entries[4],
      dataset.entries[0],
      dataset.entries[3],
      dataset.entries[1],
      dataset.entries[2],
    ]);

    const provider = epochBatchShuffledDatasetProvider(dataset, 2);

    await expect(provider(state).then(batch => idsOf(batch.entries)))
      .resolves
      .toEqual(['e', 'a']);
    await expect(provider(state).then(batch => idsOf(batch.entries)))
      .resolves
      .toEqual(['d', 'b']);
    expect(mockedShuffleArray).toHaveBeenCalledTimes(1);
  });

  it('wraps around the current shuffle at the epoch boundary, then reshuffles for the next call', async () => {
    const dataset = createDataset(['a', 'b', 'c', 'd', 'e']);
    mockedShuffleArray
      .mockReturnValueOnce([
        dataset.entries[4],
        dataset.entries[0],
        dataset.entries[3],
        dataset.entries[1],
        dataset.entries[2],
      ])
      .mockReturnValueOnce([
        dataset.entries[2],
        dataset.entries[1],
        dataset.entries[0],
        dataset.entries[4],
        dataset.entries[3],
      ]);

    const provider = epochBatchShuffledDatasetProvider(dataset, 3);

    await expect(provider(state).then(batch => idsOf(batch.entries)))
      .resolves
      .toEqual(['e', 'a', 'd']);
    await expect(provider(state).then(batch => idsOf(batch.entries)))
      .resolves
      .toEqual(['b', 'c', 'e']);
    await expect(provider(state).then(batch => idsOf(batch.entries)))
      .resolves
      .toEqual(['b', 'a', 'e']);
    expect(mockedShuffleArray).toHaveBeenCalledTimes(2);
  });
});
