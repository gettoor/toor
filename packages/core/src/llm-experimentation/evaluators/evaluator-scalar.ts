import { scalar, ScalarScoringScale } from '../../llm-as-a-judge/index.js';
import { toModelParameters } from '../experimentation-utils.js';
import { 
  ExperimentEvaluator,
  ExperimentEvaluatorInput,
} from '../experimentation-types.js';
import { EvaluatorScalarInput } from './evaluator-scalar.types.js';

/**
 * Creates a scalar experiment evaluator.
 * @category Experimentation
 * @param scoringScale - The scoring scale to use.
 * @returns A scalar experiment evaluator.
 */
export const scalarEvaluator = (
  evaluatorInput: EvaluatorScalarInput,
): ExperimentEvaluator => {
  const { scoringScale, evalPrompt } = evaluatorInput;

  return async (input: ExperimentEvaluatorInput) => {
    const { 
      modelName,
      modelProvider,
      modelParameters,
      prompt,
      response,
    } = input;

    const { result, reasoning, usage } = await scalar({
      modelName,
      modelProvider,
      modelParameters: toModelParameters(modelParameters),
      prompt,
      response,
      scoringScale: evaluatorInput.scoringScale,
      ...(evalPrompt ? { evalPrompt } : {}),
    });

    const { score } = result;
    return {
      score: {
        score,
        scoreAsString: score.toString(),
        normalizedScore:
          (score - scoringScale.min) / (scoringScale.max - scoringScale.min),
        reasoning,
        metrics: result.metrics,
      },
      usage,
    };
  }
};