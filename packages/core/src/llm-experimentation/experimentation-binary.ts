import { LanguageModel } from 'ai';

import { LLMUsage } from '../llm/index.js';
import { binary } from '../llm-as-a-judge/index.js';
import { ModelProvider } from '../model-provider/index.js';
import { toModelParameters } from './experimentation-utils.js';
import { 
  ExperimentModelParameters,
  ExperimentScore,
} from './experimentation-types.js';

/**
 * Runs a binary experiment evaluation.
 * @category Experimentation
 * @param modelName - The name of the model to use.
 * @param modelProvider - The model provider to use.
 * @param modelParameters - The model parameters to use.
 * @param prompt - The prompt to use.
 * @param answer - The answer to use.
 */
export const runBinaryExperimentEvaluation = async (
  modelName: string,
  modelProvider: ModelProvider,
  modelParameters: Omit<ExperimentModelParameters, 'name'> | undefined,
  prompt: string,
  answer: string,
): Promise<{ score: ExperimentScore, usage: LLMUsage }> => {
  const { result, reasoning, usage } = await binary({
    modelName,
    modelProvider,
    modelParameters: toModelParameters(modelParameters),
    prompt,
    response: answer,
  });
  const score = result ? 1 : 0;
  return {
    score: {
      score,
      scoreAsString: score.toString(),
      normalizedScore: score,
      reasoning,
    },
    usage,
  };
}