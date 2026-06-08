import { CallSettings } from 'ai';
import { ModelParameters } from './types.js';

export function ifDefined<T>(
  value: T | undefined,
  key: string,
  defaultValue?: T,
): Record<string, T> {
  if (value == null) {
    return defaultValue != null ? { [key]: defaultValue } : {};
  }
  return { [key]: value };
}

export function buildModelCallSettings(
  modelParameters?: ModelParameters,
): CallSettings {
  return {
    ...ifDefined(modelParameters?.temperature, 'temperature', 0),
  }
}