import { EvaluatorOutput } from './evaluator-types.js';
import { RPEExecutorOutput } from './rpe-executor/index.js';

export async function evaluateResponses(
  responses: RPEExecutorOutput[],
): Promise<EvaluatorOutput> {
  return {};
}