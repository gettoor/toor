import { InternalToorError, ToorError } from '../../errors/index.js';
import { RPEState } from '../rpe-state/index.js';
import { RPEDataset, RPEDatasetEntry } from '../rpe-dataset/index.js';
import { RPEDatasetProvider } from './rpe-dataset-provider-types.js';
import {
  FailurePrioritizedDatasetEntrySnapshotResult,
  FailurePrioritizedDatasetEntrySnapshot,
  FailurePrioritizedDatasetProviderInput,
} from './failure-prioritized-rpe-dataset-provider-types.js';
import { shuffleArray } from '../../array/index.js';

export function failurePrioritizedDatasetProvider(
  input: FailurePrioritizedDatasetProviderInput,
): RPEDatasetProvider {
  const {
    dataset,
    persistentFailureCount = 0,
    newFailureCount = 0,
    passedCount = 0,
    explorationCount = 0,
  } = input;
  const totalCount = persistentFailureCount + newFailureCount +
    passedCount + explorationCount;

  return async (state: RPEState) => {
    const allSnapshots = buildDatasetEntrySnapshots(dataset, state);
    const entries: RPEDatasetEntry[] = [];

    // pick a number of dataset entries that satisfy a predicate
    const pick = (
      snapshots: FailurePrioritizedDatasetEntrySnapshot[],
      predicate: (snapshot: FailurePrioritizedDatasetEntrySnapshot) => boolean,
      count: number,
    ): void => {
      const picked: RPEDatasetEntry[] = [];
      for (let snapshot of snapshots) {
        // doesn't satisfy the predicate?
        if (!predicate(snapshot)) {
          continue;
        }

        // don't pick the same dataset entry twice
        const has = entries.some(entry => {
          return entry.datasetEntryId === snapshot.datasetEntryId;
        });
        if (has) {
          continue;
        }

        // add the dataset entry
        const datasetEntry = state.datasetEntries.find(entry => {
          return entry.datasetEntryId === snapshot.datasetEntryId;
        });
        if (!datasetEntry) {
          throw new InternalToorError(
            `Dataset entry ${ToorError.quote(snapshot.datasetEntryId)} not ` +
            `found in failure-prioritized dataset provider`
          );
        }
        picked.push(datasetEntry);

        // have enough?
        if (picked.length >= count) {
          break;
        }
      }
      entries.push(...picked);
    }

    // persistent failures
    const isPersistentFailure = (
      snapshot: FailurePrioritizedDatasetEntrySnapshot,
    ): boolean => {
      return (
        snapshot.currentResult === 'failed' &&
        snapshot.consecutiveFailures >= 2
      );
    };
    pick(allSnapshots, isPersistentFailure, persistentFailureCount);

    // newly failed
    const isNewlyFailed = (
      snapshot: FailurePrioritizedDatasetEntrySnapshot,
    ): boolean => {
      return (
        snapshot.previousResult === 'passed' &&
        snapshot.currentResult === 'failed'
      );
    };
    pick(allSnapshots, isNewlyFailed, newFailureCount);

    // passed entries
    pick(
      pickPassedSnapshots(allSnapshots),
      () => true,
      passedCount,
    );

    // exploration (entries selected least recently)
    pick(
      pickExplorationSnapshots(allSnapshots),
      () => true,
      explorationCount,
    );

    // fill up to the batch size with shuffled entries
    const shuffledSnapshots = shuffleArray(allSnapshots);
    pick(shuffledSnapshots, () => true, totalCount - entries.length);

    return { entries };
  };
}

function pickPassedSnapshots(
  snapshots: FailurePrioritizedDatasetEntrySnapshot[],
): FailurePrioritizedDatasetEntrySnapshot[] {
  return snapshots.filter((snapshot) => {
    return snapshot.currentResult === 'passed';
  });
}

function pickExplorationSnapshots(
  snapshots: FailurePrioritizedDatasetEntrySnapshot[],
): FailurePrioritizedDatasetEntrySnapshot[] {
  return [...snapshots].sort((a, b) => {
    return (a.lastSelectedIteration ?? -1) - (b.lastSelectedIteration ?? -1);
  });
}

function buildDatasetEntrySnapshots(
  dataset: RPEDataset,
  state: RPEState,
): FailurePrioritizedDatasetEntrySnapshot[] {
  const NO_SCORE = -1;
  const snapshots: FailurePrioritizedDatasetEntrySnapshot[] = [];

  const findSnapshot = (
    datasetEntryId: string,
  ): FailurePrioritizedDatasetEntrySnapshot | undefined => {
    return snapshots.find((snapshot) => {
      return snapshot.datasetEntryId === datasetEntryId;
    });
  };

  const resolveSnapshot = (
    datasetEntryId: string,
  ): FailurePrioritizedDatasetEntrySnapshot => {
    let snapshot = findSnapshot(datasetEntryId);
    if (!snapshot) {
      snapshot = {
        datasetEntryId,
        consecutiveFailures: 0,
        totalFailures: 0,
      };
      snapshots.push(snapshot);
    }
    return snapshot;
  };

  // initialize snapshots
  dataset.entries.forEach((entry) => {
    resolveSnapshot(entry.datasetEntryId);
  });

  const updateResult = (
    snapshot: FailurePrioritizedDatasetEntrySnapshot,
    result: FailurePrioritizedDatasetEntrySnapshotResult,
  ): void => {
    if (snapshot.currentResult !== undefined) {
      snapshot.previousResult = snapshot.currentResult;
    }
    snapshot.currentResult = result;
  };

  const updateScore = (
    snapshot: FailurePrioritizedDatasetEntrySnapshot,
    score: number,
  ): void => {
    if (snapshot.currentScore !== NO_SCORE) {
      snapshot.previousScore = snapshot.currentScore;
    }
    snapshot.currentScore = score;
  };

  const iterations = [...state.iterationHistory, state.iteration];
  iterations.forEach((iteration) => {
    const { iterationNo, trainingAggregatedEvaluations = [] } = iteration;
    
    // process passed evaluations
    const passedEvaluations = trainingAggregatedEvaluations.flatMap(
      (aggregation) => aggregation.passedEvaluations
    );
    passedEvaluations.forEach((evaluation) => {
      const snapshot = resolveSnapshot(evaluation.datasetEntry.datasetEntryId);
      updateResult(snapshot, 'passed');
      updateScore(snapshot, evaluation.score);
      snapshot.consecutiveFailures = 0;
      snapshot.lastSelectedIteration = iterationNo;
      snapshot.lastPassedIteration = iterationNo;
    });

    // process failed evaluations
    const failedEvaluations = trainingAggregatedEvaluations.flatMap(
      (aggregation) => aggregation.failedEvaluations
    );
    failedEvaluations.forEach((evaluation) => {
      const snapshot = resolveSnapshot(evaluation.datasetEntry.datasetEntryId);
      updateResult(snapshot, 'failed');
      updateScore(snapshot, evaluation.score);
      snapshot.consecutiveFailures++;
      snapshot.totalFailures++;
      snapshot.lastSelectedIteration = iterationNo;
    });
  });

  return snapshots;
}

/*
50% persistent failures
20% new failures
20% representative passes
10% exploration
*/