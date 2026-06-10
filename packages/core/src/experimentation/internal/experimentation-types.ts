import { LanguageModel } from 'ai';

import { 
  ExperimentModelParameters,
  ExperimentScore,
} from '../experimentation-types.js';

/**
 * Type for running an experiment evaluation.
 * @param model - The model to use for the evaluation.
 * @param modelParameters - The model parameters to use for the evaluation.
 * @param prompt - The prompt to evaluate.
 * @param answer - The answer to evaluate.
 * @returns The score of the evaluation.
 */
export type RunExperimentEvaluation = (
  evalModel: LanguageModel,
  evalModelParameters:
    Omit<ExperimentModelParameters, 'name'> |
    undefined,
  prompt: string,
  answer: string,
) => Promise<ExperimentScore>;
