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
   * Variables to replace in the prompt.
   */
  vars?: Record<string, RPEDatasetEntryVarValue>;

  /**
   * Expected response from a LLM model to the prompt.
   */
  expectedResponse?: string;
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