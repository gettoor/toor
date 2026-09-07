/**
 * Value type for the RPE metadata.
 * @category Reflective Prompt Evolution
 */
export type RPEMetadataValue = string | number | boolean | null | undefined;

/**
 * Metadata type for the RPE.
 * @category Reflective Prompt Evolution
 */
export type RPEMetadata = Record<string, RPEMetadataValue>;

/**
 * Response type for the RPE basic.
 * @category Reflective Prompt Evolution
 */
export type RPEResponse = string | object;