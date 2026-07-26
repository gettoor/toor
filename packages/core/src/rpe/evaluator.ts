import { runParallelBatchesOrThrow } from '../concurrency/index.js';
import { RPEExecutorOutput } from './rpe-executor/index.js';
import { RPEEvaluator, RPEEvaluatorInput } from './rpe-evaluator/index.js';
import { DEFAULT_EVALUATOR_PARALLELISM } from './evaluator-consts.js';
import { EvaluatorOutput, EvaluatorPromptOutput } from './evaluator-types.js';

/**
 * Evaluates responses for a number of prompts.
 * @category Reflective Prompt Evolution
 * @param prompts - Prompts to evaluate.
 * @param evaluator - Evaluator to use for the evaluations.
 * @returns Evaluations for the responses.
 */
export async function evaluatePrompts(
  prompts: RPEEvaluatorInput[],
  evaluator: RPEEvaluator,
  parallelism?: number,
): Promise<EvaluatorOutput> {
  parallelism = parallelism ?? DEFAULT_EVALUATOR_PARALLELISM;
  const evaluations: Record<string, EvaluatorPromptOutput> = {};

  // tasks
  const tasks = prompts.map(async prompt => {
    // evaluate the prompt
    const evaluation = await evaluator(prompt);

    // keep the evaluation
    const promptHash = prompt.prompt.promptHash;
    if (!evaluations[promptHash]) {
      evaluations[promptHash] = {
        prompt: prompt.prompt,
        evaluations: [],
      };
    }
    evaluations[promptHash].evaluations.push(evaluation);
  });

  // run tasks in parallel
  await runParallelBatchesOrThrow(tasks, parallelism);
  return { evaluations: Object.values(evaluations) };
}

/**
 * Evaluates responses for a number of prompts.
 * @category Reflective Prompt Evolution
 * @param prompts - Prompts to evaluate.
 * @param evaluator - Evaluator to use for the evaluations.
 * @returns Evaluations for the responses.
 */
export async function evaluateResponses(
  responses: RPEExecutorOutput[],
  evaluator: RPEEvaluator,
  parallelism?: number,
): Promise<EvaluatorOutput> {
  const inputs = responses.map(response => ({
    prompt: response.input.prompt,
    response: response.response,
    expectedResponse: response.input.datasetEntry.expectedResponse,
  }));
  return evaluatePrompts(inputs, evaluator, parallelism);
}

export async function evaluateCandidates(
  candidates: RPEEvaluatorInput[],
  evaluator: RPEEvaluator,
  parallelism?: number,
): Promise<EvaluatorOutput> {
  return evaluatePrompts(candidates, evaluator, parallelism);
}