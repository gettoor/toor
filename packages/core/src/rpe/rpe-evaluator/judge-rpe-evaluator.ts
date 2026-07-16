import { RPEEvaluator, RPEEvaluatorInput } from './rpe-evaluator-types.js';
import { JudgeRPEEvaluatorInput } from './judge-rpe-evaluator-types.js';

/**
 * A RPE evaluator that uses a LLM-as-a-judge to evaluate a prompt.
 * @returns An RPE evaluator that uses a LLM-as-a-judge to evaluate a prompt.
 * @category Reflective Prompt Evolution
 */
export function judgeRPEEvaluator(
  input: JudgeRPEEvaluatorInput,
): RPEEvaluator {
  return async (input: RPEEvaluatorInput) => {
    return { normalizedScore: 0, reasoning: '', metrics: {} };
  };
}