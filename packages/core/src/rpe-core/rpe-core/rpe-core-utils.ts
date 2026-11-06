import { RPEState } from '../rpe-state/index.js';
import { RPEMetadataValue } from './rpe-core-types.js';

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
