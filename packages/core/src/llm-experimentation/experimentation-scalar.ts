import { LLMUsage } from '../llm/index.js';
import { scalar, ScalarScoringScale } from '../llm-as-a-judge/index.js';
import { ModelProvider } from '../model-provider/index.js';
import { toModelParameters } from './experimentation-utils.js';
import { 
  ExperimentModelParameters,
  ExperimentScore,
} from './experimentation-types.js';

/**
 * Runs a scalar experiment evaluation.
 * @category Experimentation
 * @param modelName - The language model to use.
 * @param modelParameters - The model parameters to use.
 * @param prompt - The prompt to use.
 * @param answer - The answer to use.
 * @param scoringScale - The scoring scale to use.
 */
export const runScalarExperimentEvaluation = async (
  modelName: string,
  modelProvider: ModelProvider,
  modelParameters: Omit<ExperimentModelParameters, 'name'> | undefined,
  prompt: string,
  answer: string,
  scoringScale: ScalarScoringScale,
): Promise<{ score: ExperimentScore, usage: LLMUsage }> => {
  const { result, reasoning, usage } = await scalar({
    modelName,
    modelProvider,
    modelParameters: toModelParameters(modelParameters),
    prompt,
    response: answer,
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
        // TODO: add metrics
      },
    },
    usage,
  };
}
