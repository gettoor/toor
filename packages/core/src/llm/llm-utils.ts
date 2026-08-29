import { CallSettings } from 'ai';
import { LLMModelUsage, LLMUsage, ModelParameters } from './llm-types.js';

/**
 * Sums the usage of language models. That is, flattens the usage of all models
 * into a single usage object.
 * @category LLM
 * @param usage - Usage to sum.
 * @returns Summed usage.
 */
export function sumLLMUsage(
  usage: LLMUsage,
): Pick<LLMModelUsage, 'inputTokens' | 'outputTokens'> {
  const sum: Pick<LLMModelUsage, 'inputTokens' | 'outputTokens'> = {
    inputTokens: 0,
    outputTokens: 0,
  };
  for (const modelUsage of usage.modelUsage) {
    sum.inputTokens! += modelUsage.inputTokens ?? 0;
    sum.outputTokens! += modelUsage.outputTokens ?? 0;
  }
  return sum;
}

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

export function removeNewlines(text: string): string {
  return text.replace(/\n/g, ' ');
}