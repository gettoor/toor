import { scalar, SCALAR_SCORING_DEFAULT } from '../../llm-as-a-judge/index.js';
import { RPEEvaluator, RPEEvaluatorInput } from './rpe-evaluator-types.js';
import { JudgeRPEEvaluatorInput } from './judge-rpe-evaluator-types.js';
import { JUDGE_RPE_EVALUATOR_PROMPT } from './judge-rpe-evaluator-prompt.js';

/**
 * A RPE evaluator that uses a LLM-as-a-judge to evaluate a prompt.
 * @category Reflective Prompt Evolution
 * @param input - Input for the RPE evaluator.
 * @returns An RPE evaluator that uses a LLM-as-a-judge to evaluate a prompt.
 */
export function judgeRPEEvaluator(
  input: JudgeRPEEvaluatorInput,
): RPEEvaluator {
  const { 
    modelName,
    modelProvider,
    modelParameters,
    scoringScale = SCALAR_SCORING_DEFAULT,
    metrics,
  } = input;

  return async (input: RPEEvaluatorInput) => {
    const expectedResponse = input.response.input.datasetEntry.expectedResponse;

    // do plain LLM-as-a-judge without expected response
    if (!expectedResponse) {
      const result = await scalar({
        modelName,
        modelProvider,
        modelParameters,
        prompt: input.response.input.prompt.prompt,
        response: input.response.response,
        scoringScale,
        metrics,
      });
      return {
        response: input.response,
        score: result.result.normalizedScore,
        reasoning: result.reasoning,
        metrics: result.result.metrics,
      }
    }

    // do LLM-as-a-judge with expected response
    const result = await scalar({
      modelName,
      modelProvider,
      modelParameters,
      prompt: input.response.input.prompt.prompt,
      response: input.response.response,
      scoringScale,
      evalPrompt: JUDGE_RPE_EVALUATOR_PROMPT,
      additionalPromptValues: {
        expected_response: expectedResponse,
      },
    });
    return {
      response: input.response,
      score: result.result.normalizedScore,
      reasoning: result.reasoning,
      metrics: result.result.metrics,
    }
  };
}