import { binary } from '../../llm-as-a-judge/index.js';
import { toModelParameters } from '../experimentation-utils.js';
import { 
  ExperimentEvaluator,
  ExperimentEvaluatorInput,
  ExperimentEvaluatorOutput,
} from '../experimentation-types.js';
import { EvaluatorBinaryInput } from './evaluator-binary.types.js';

/**
 * Creates a binary experiment evaluator.
 * @category Experimentation
 * @returns A binary experiment evaluator.
 */
export const binaryEvaluator = (
  evaluatorInput: EvaluatorBinaryInput = {},
): ExperimentEvaluator => {
  const { evalPrompt } = evaluatorInput;

  return async (
    input: ExperimentEvaluatorInput,
  ): Promise<ExperimentEvaluatorOutput> => {
    const { 
      modelName,
      modelProvider,
      modelParameters,
      prompt,
      response,
    } = input;

    const { result, reasoning, usage } = await binary({
      modelName,
      modelProvider,
      modelParameters: toModelParameters(modelParameters),
      prompt,
      response,
      ...(evalPrompt ? { evalPrompt } : {}),
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
};