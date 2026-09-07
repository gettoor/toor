import { RPEResponse } from '../rpe-core/index.js';

/**
 * RPE dataset entry variable value.
 * @category Reflective Prompt Evolution
 */
export type RPEDatasetEntryVarValue = any;

/**
 * RPE dataset entry.
 * @category Reflective Prompt Evolution
 */
export interface RPEDatasetEntry {
  /**
   * Variables to replace in the candidate.
   */
  vars?: Record<string, RPEDatasetEntryVarValue>;

  /**
   * Expected response from a LLM model to the candidate.
   */
  expectedResponse?: RPEResponse;
}

/**
 * RPE dataset.
 * @category Reflective Prompt Evolution
 */
export interface RPEDataset {
  /**
   * Entries in the dataset.
   */
  entries: RPEDatasetEntry[];
}