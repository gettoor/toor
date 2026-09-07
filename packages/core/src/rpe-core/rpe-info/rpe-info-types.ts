/**
 * Value of a property of the RPE process info.
 * @category Reflective Prompt Evolution
 */
export type RPEPropertyValue = string | number | boolean | null | undefined;

/**
 * Property of the RPE process info.
 * @category Reflective Prompt Evolution
 */
export interface RPEProperty {
  /**
   * Key of the property.
   */
  key: string;

  /**
   * Description of the property.
   */
  description?: string;

  /**
   * Value of the property.
   */
  value: RPEPropertyValue;
}

/**
 * Properties of the RPE process info.
 * @category Reflective Prompt Evolution
 */
export type RPEProperties = RPEProperty[];