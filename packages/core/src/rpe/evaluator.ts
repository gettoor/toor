import { runParallelBatchesOrThrow } from '../concurrency/index.js';
import { RPEExecutorOutput } from './rpe-executor/index.js';
import { RPEEvaluator } from './rpe-evaluator/index.js';
import { DEFAULT_EVALUATOR_PARALLELISM } from './evaluator-consts.js';
import { EvaluatorOutput, EvaluatorPromptOutput } from './evaluator-types.js';

/**
 * Evaluates responses for a number of prompts.
 * @category Reflective Prompt Evolution
 * @param responses - Responses to evaluate.
 * @param evaluator - Evaluator to use for the evaluations.
 * @returns Evaluations for the responses.
 */
export async function evaluateResponses(
  responses: RPEExecutorOutput[],
  evaluator: RPEEvaluator,
  parallelism?: number,
): Promise<EvaluatorOutput> {
  parallelism = parallelism ?? DEFAULT_EVALUATOR_PARALLELISM;
  const evaluations: Record<string, EvaluatorPromptOutput> = {};

  // tasks
  const tasks = responses.map(async response => {
    const prompt = response.input.prompt;
    const promptHash = prompt.promptHash;

    // evaluate the response
    const evaluation = await evaluator({ response });

    // keep the evaluation
    if (!evaluations[promptHash]) {
      evaluations[promptHash] = {
        prompt,
        evaluations: [],
      };
    }
    evaluations[promptHash].evaluations.push(evaluation);
  });

  // run tasks in parallel
  await runParallelBatchesOrThrow(tasks, parallelism);
  return { evaluations: Object.values(evaluations) };
}