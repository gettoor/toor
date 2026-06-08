import { ExperimentModelParameters } from './experimentation-types.js';

export function toModelParameters(
  modelParameters: Omit<ExperimentModelParameters, 'name'> | undefined,
): Record<string, unknown> {
  if (!modelParameters) {
    return {};
  }
  return {
    temperature: modelParameters.temperature,
  };
}
