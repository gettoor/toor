import { LanguageModel } from 'ai';

import { LLMUsage } from '../llm/index.js';
import { scalar, ScalarScoringScale } from '../llm-as-a-judge/index.js';
import { toModelParameters } from './experimentation-utils.js';
import { 
  ExperimentModelParameters,
  ExperimentScore,
} from './experimentation-types.js';

export const runScalarExperimentEvaluation = async (
  model: LanguageModel,
  modelParameters: Omit<ExperimentModelParameters, 'name'> | undefined,
  prompt: string,
  answer: string,
  scoringScale: ScalarScoringScale,
): Promise<{ score: ExperimentScore, usage: LLMUsage }> => {
  const { result, reasoning, usage } = await scalar({
    model: model,
    modelParameters: toModelParameters(modelParameters),
    prompt,
    answer,
    scoringScale,
  });

  const { score } = result;
  return {
    score: {
      score,
      scoreAsString: score.toString(),
      normalizedScore: score / (scoringScale.max - scoringScale.min),
      reasoning,
      metrics: {
        correctness: result.correctness,
        completeness: result.completeness,
        relevance: result.relevance,
      },
    },
    usage,
  };
}
