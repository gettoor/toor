import { CallSettings } from 'ai';
import { ModelParameters } from '../llm/index.js';

function ifDefined<T>(
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
    ...ifDefined(modelParameters?.maxOutputTokens, 'maxOutputTokens'),
    ...ifDefined(modelParameters?.temperature, 'temperature'),
    ...ifDefined(modelParameters?.topP, 'topP'),
    ...ifDefined(modelParameters?.topK, 'topK'),
    ...ifDefined(modelParameters?.presencePenalty, 'presencePenalty'),
    ...ifDefined(modelParameters?.frequencyPenalty, 'frequencyPenalty'),
  }
}