import { ModelParameters } from '../../llm/index.js';
import { 
  RPEPropertyValue,
  RPEProperties,
  RPEProperty,
} from './rpe-info-types.js';

export function rpePropertyIfDef(
  value: RPEPropertyValue | undefined,
  key: string,
  description?: string,
): RPEProperty[] {
  if (value === undefined) {
    return [];
  }
  return [{ key, value, description }];
}

export function modelParametersToRPEInfo(
  modelParameters?: ModelParameters,
): RPEProperties {
  if (!modelParameters) {
    return [];
  }
  return [
    ...rpePropertyIfDef(
      modelParameters.maxOutputTokens,
      'maxOutputTokens',
      'Maximum number of tokens the model may generate in its response.',
    ),
    ...rpePropertyIfDef(
      modelParameters.temperature,
      'temperature',
      'Controls sampling randomness.',
    ),
    ...rpePropertyIfDef(
      modelParameters.topP,
      'topP',
      'Controls nucleus sampling.',
    ),
    ...rpePropertyIfDef(
      modelParameters.topK,
      'topK',
      'Controls top-k sampling..',
    ),
    ...rpePropertyIfDef(
      modelParameters.presencePenalty,
      'presencePenalty',
      'Penalizes tokens that have already appeared in the generated text.',
    ),
    ...rpePropertyIfDef(
      modelParameters.frequencyPenalty,
      'frequencyPenalty',
      'Penalizes tokens based on how frequently they have already appeared ' +
      'in the generated text.',
    ),
  ];
}