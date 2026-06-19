import { scalar } from '../../llm-as-a-judge/index.js';
import { toModelParameters } from '../experimentation-utils.js';
import { DefaultModelProvider } from '../../model-provider/index.js';
import { 
  ExperimentEvaluator,
  ExperimentEvaluatorInput,
} from '../experimentation-types.js';
import { EvaluatorScalarInput } from './evaluator-scalar.types.js';

/**
 * Creates a scalar experiment evaluator.
 * @category Experimentation
 * @param evaluatorInput - The input for the scalar evaluator.
 * @returns A scalar experiment evaluator.
 */
export const scalarEvaluator = (
  evaluatorInput: EvaluatorScalarInput,
): ExperimentEvaluator => {
  const { 
    scoringScale,
    modelName,
    modelProvider,
    modelParameters,
    evalPrompt,
  } = evaluatorInput;

  return async (input: ExperimentEvaluatorInput) => {
    const { 
      prompt,
      response,
    } = input;

    const { result, reasoning, usage } = await scalar({
      modelName,
      modelProvider: modelProvider ?? new DefaultModelProvider(),
      ...(modelParameters ? { modelParameters } : {}),
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