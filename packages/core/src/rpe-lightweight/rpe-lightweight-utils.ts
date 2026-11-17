import {
  RPELightweightExecutorAndCriticModels,
  RPELightweightInput,
} from './rpe-lightweight-types.js';

/**
 * Function to create a RPE lightweight input with the executor and critic
 * models. A critic model is used for the evaluator, analyzer, candidate
 * generator and components other than the executor.
 * @category Reflective Prompt Evolution
 * @param input - Input for the RPE lightweight preset executor and critic
 *   models.
 * @returns RPE lightweight input with the executor and critic models.
 */
export function rpeLightweightExecutorAndCriticModels(
  input: RPELightweightExecutorAndCriticModels,
): Pick<RPELightweightInput,
  | 'executorModelName'
  | 'executorModelParameters'
  | 'evaluatorModelName'
  | 'evaluatorModelParameters'
  | 'analyzerModelName'
  | 'analyzerModelParameters'
  | 'candidateGeneratorModelName'
  | 'candidateGeneratorModelParameters'
  | 'candidateValidatorModelName'
  | 'candidateValidatorModelParameters'
> {
  return {
    executorModelName: input.executorModelName,
    executorModelParameters: input.executorModelParameters,
    evaluatorModelName: input.criticModelName,
    evaluatorModelParameters: input.criticModelParameters,
    analyzerModelName: input.criticModelName,
    analyzerModelParameters: input.criticModelParameters,
    candidateGeneratorModelName: input.criticModelName,
    candidateGeneratorModelParameters: input.criticModelParameters,
    candidateValidatorModelName: input.criticModelName,
    candidateValidatorModelParameters: input.criticModelParameters,
  }
}