import { ExperimentModelParameters } from './experimentation-types.js';

/**
 * Converts experiment model parameters to model parameters.
 * @category Experimentation
 * @param modelParameters - The experiment model parameters to convert.
 * @returns Model parameters.
 */
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
