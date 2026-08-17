import { runParallelBatchesOrThrow } from '../concurrency/index.js';
import { RPEExecutorOutput } from './rpe-executor/index.js';
import { RPEEvaluator, RPEEvaluatorInput } from './rpe-evaluator/index.js';
import { DEFAULT_EVALUATOR_PARALLELISM } from './evaluator-consts.js';
import { EvaluatorOutput, EvaluatorPromptOutput } from './evaluator-types.js';
import { findPromptById, RPEState } from './rpe-state/index.js';
import { promptRefFromPrompt } from './rpe-prompt/index.js';

/**
 * Evaluates responses for a number of prompts.
 * @category Reflective Prompt Evolution
 * @param inputs - Inputs for the evaluations.
 * @param evaluator - Evaluator to use for the evaluations.
 * @returns Evaluations for the responses.
 */
export async function evaluatePrompts(
  inputs: RPEEvaluatorInput[],
  evaluator: RPEEvaluator,
  parallelism?: number,
): Promise<EvaluatorOutput> {
  parallelism = parallelism ?? DEFAULT_EVALUATOR_PARALLELISM;
  const evaluations: Record<string, EvaluatorPromptOutput> = {};

  // tasks
  const tasks = inputs.map(async input => {
    // evaluate the prompt
    const evaluation = await evaluator(input);

    // keep the evaluation
    const promptId = input.prompt.promptId;
    if (!evaluations[promptId]) {
      evaluations[promptId] = {
        promptRef: promptRefFromPrompt(input.prompt),
        evaluations: [],
      };
    }
    evaluations[promptId].evaluations.push(evaluation);
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
  state: RPEState,
  responses: RPEExecutorOutput[],
  evaluator: RPEEvaluator,
  parallelism?: number,
): Promise<EvaluatorOutput> {
  const inputs = responses.map(response => ({
    prompt: findPromptById(state, response.promptRef.promptId),
    response: response.response,
    expectedResponse: response.datasetEntry.expectedResponse,
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