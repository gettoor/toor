import { RPEDataset } from '../rpe-dataset/index.js';

/**
 * Result of a dataset entry.
 */
export type FailurePrioritizedDatasetEntrySnapshotResult =
  | 'passed'
  | 'failed';

/**
 * State of a dataset entry for the failure-prioritized dataset provider.
 */
export interface FailurePrioritizedDatasetEntrySnapshot {
  /**
   * Unique identifier of the dataset entry.
   */
  datasetEntryId: string;

  /**
   * Current result of the dataset entry.
   */
  currentResult?: FailurePrioritizedDatasetEntrySnapshotResult;

  /**
   * Previous result of the dataset entry.
   */
  previousResult?: FailurePrioritizedDatasetEntrySnapshotResult;

  /**
   * Current score of the dataset entry.
   */
  currentScore?: number;

  /**
   * Previous score of the dataset entry.
   */
  previousScore?: number;

  /**
   * Number of consecutive failures of the dataset entry.
   */
  consecutiveFailures: number;

  /**
   * Total number of failures of the dataset entry.
   */
  totalFailures: number;

  /**
   * Last iteration the dataset entry was selected.
   */
  lastSelectedIteration?: number;

  /**
   * Last iteration the dataset entry passed.
   */
  lastPassedIteration?: number;  
}

/**
 * Provider for the failure-prioritized dataset.
 * @category Reflective Prompt Evolution
 */
export interface FailurePrioritizedDatasetProviderInput {
  /**
   * Dataset to use.
   */
  dataset: RPEDataset;

  /**
   * Number of persistent failures. A persistent failure is a dataset entry
   * that has failed for at least N consecutive iterations.
   */
  persistentFailureCount?: number;

  /**
   * Number of newly failed dataset entries. A newly failed dataset entry is a
   * dataset entry that has failed for the first time after passing at least
   * once. It can mean "the latest candidate fixed something but introduced
   * a regression."
   */
  newFailureCount?: number;

  /**
   * Number of dataset entries that passed.
   */
  passedCount?: number;

  /**
   * Number of dataset entries to explore. An exploration dataset entry is a
   * dataset entry that has been selected least recently.
   */
  explorationCount?: number;
}