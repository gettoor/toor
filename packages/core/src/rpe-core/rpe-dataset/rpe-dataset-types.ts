import { RPEResponse } from '../rpe-core/index.js';

/**
 * RPE dataset entry.
 * @category Reflective Prompt Evolution
 */
export interface RPEDatasetEntry<
  ExpectedResponse = RPEResponse,
  VarValue = any
> {
  /**
   * Unique identifier of the dataset entry.
   */
  datasetEntryId: string;

  /**
   * Variables to replace in the candidate.
   */
  vars: Record<string, VarValue>;

  /**
   * Expected response from a LLM model to the candidate.
   */
  expectedResponse?: ExpectedResponse;

  /**
   * Reasoning for why the expected response is correct.
   */
  expectedResponseReasoning?: string;
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
