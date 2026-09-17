/**
 * Error thrown when a duplicate dataset entry is found.
 * @category Reflective Prompt Evolution
 */
export class DuplicateDatasetEntryError extends Error {
  constructor(public readonly datasetEntryId: string) {
    super(`Duplicate dataset entry: ${datasetEntryId}`);
  }
}