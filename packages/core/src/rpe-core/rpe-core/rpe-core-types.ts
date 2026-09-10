/**
 * Primitive type for the RPE metadata.
 * @category Reflective Prompt Evolution
 */
export type RPEMetadataPrimitive =
  | string
  | number
  | boolean
  | null
  | undefined;

/**
 * Object type for the RPE metadata.
 * @category Reflective Prompt Evolution
 */
export interface RPEMetadataObject {
  [key: string]: RPEMetadataValue;
}

/**
 * Value type for the RPE metadata.
 * @category Reflective Prompt Evolution
 */
export type RPEMetadataValue =
  | RPEMetadataPrimitive
  | RPEMetadataValue[]
  | RPEMetadataObject;

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