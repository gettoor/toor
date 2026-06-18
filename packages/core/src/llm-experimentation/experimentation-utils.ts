import { 
  ExperimentModelParameters,
  ExperimentScore,
  ToExperimentScoreInput,
} from './experimentation-types.js';

/**
 * Converts experiment model parameters to model parameters.
 * @category Experimentation
 * @param modelParameters - The experiment model parameters to convert.
 * @returns Model parameters.
 */
export function toModelParameters(
  modelParameters: ExperimentModelParameters | undefined,
): Record<string, unknown> {
  if (!modelParameters) {
    return {};
  }
  const { name: _name, ...rest } = modelParameters;
  return rest;
}

/**
 * Converts an input to an experiment score.
 * @category Experimentation
 * @param input - The input for the experiment score.
 * @returns The experiment score.
 */
export function toExperimentScore(
  input: ToExperimentScoreInput,
): ExperimentScore {
  const { score, minScore, maxScore, reasoning } = input;
  return {
    score,
    scoreAsString: score.toString(),
    normalizedScore: (score - minScore) / (maxScore - minScore),
    ...(reasoning ? { reasoning } : {}),
  };
}