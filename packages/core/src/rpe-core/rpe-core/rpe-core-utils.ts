import { InternalToorError, ToorError } from '../../errors/index.js';
import { RPEState } from '../rpe-state/index.js';
import { RPEMetadataValue, RPEResponse } from './rpe-core-types.js';

/**
 * Convert a response to a string.
 * @category Reflective Prompt Evolution
 * @param response - Response to convert.
 * @param objectFormat - Format to use for the object.
 * @returns String representation of the response.
 */
export function responseToString(
  response: RPEResponse,
  objectFormat: 'json' = 'json',
): string {
  if (typeof response === 'string') {
    return response;
  }
  switch (objectFormat) {
    case 'json':
      return JSON.stringify(response);
    default:
      throw new InternalToorError(
        `Unsupported object format: ${ToorError.quote(objectFormat)}`,
      );
  }
}

/**
 * Resolve a value from the metadata of the RPE.
 * @category Reflective Prompt Evolution
 * @param state - State of the RPE.
 * @param metadataKey - Key of the metadata.
 * @param defaultValue - Default value to use if the metadata is not present.
 * @returns Value of the metadata.
 */
export function resolveRPEMetadataValue<T extends RPEMetadataValue>(
  state: RPEState,
  metadataKey: string,
  defaultValue: T,
): T;

/**
 * Resolve a value from the metadata of the RPE.
 * @category Reflective Prompt Evolution
 * @param state - State of the RPE.
 * @param metadataKey - Key of the metadata.
 * @param defaultValue - Default value to use if the metadata is not present.
 * @returns Value of the metadata.
 */
export function resolveRPEMetadataValue<T extends RPEMetadataValue>(
  state: RPEState,
  metadataKey: string,
  defaultValue: T | undefined,
): T | undefined;

export function resolveRPEMetadataValue<T extends RPEMetadataValue>(
  state: RPEState,
  metadataKey: string,
  defaultValue: T | undefined,
): T | undefined {
  let value = state.metadata[metadataKey] as T | undefined;
  if (!value) {
    state.metadata[metadataKey] = defaultValue;
    return defaultValue;
  }
  return value;
}
