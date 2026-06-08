import { LanguageModel } from 'ai';

import { LLMUsage } from '../llm/index.js';
import { binary } from '../llm-as-a-judge/index.js';
import { toModelParameters } from './experimentation-utils.js';
import { 
  ExperimentModelParameters,
  ExperimentScore,
} from './experimentation-types.js';

export const runBinaryExperimentEvaluation = async (
  model: LanguageModel,
  modelParameters: Omit<ExperimentModelParameters, 'name'> | undefined,
  prompt: string,
  answer: string,
): Promise<{ score: ExperimentScore, usage: LLMUsage }> => {
  const { result, reasoning, usage } = await binary({
    model,
    modelParameters: toModelParameters(modelParameters),
    prompt,
    answer,
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