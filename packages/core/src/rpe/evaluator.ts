import { runParallelBatchesOrThrow } from '../concurrency/index.js';
import { RPEExecutorOutput } from './rpe-executor/index.js';
import { RPEEvaluator, RPEEvaluatorInput } from './rpe-evaluator/index.js';
import { DEFAULT_EVALUATOR_PARALLELISM } from './evaluator-consts.js';
import { EvaluatorOutput, EvaluatorCandidateOutput } from './evaluator-types.js';
import { findCandidateById, RPEState } from './rpe-state/index.js';
import { candidateRefFromCandidate } from './rpe-candidate/index.js';

/**
 * Evaluates responses for a number of candidates.
 * @category Reflective Prompt Evolution
 * @param inputs - Inputs for the evaluations.
 * @param evaluator - Evaluator to use for the evaluations.
 * @returns Evaluations for the responses.
 */
export async function evaluateCandidates(
  inputs: RPEEvaluatorInput[],
  evaluator: RPEEvaluator,
  parallelism?: number,
): Promise<EvaluatorOutput> {
  parallelism = parallelism ?? DEFAULT_EVALUATOR_PARALLELISM;
  const evaluations: Record<string, EvaluatorCandidateOutput> = {};

  // tasks
  const tasks = inputs.map(async input => {
    // evaluate the candidate
    const evaluation = await evaluator.run(input);

    // keep the evaluation
    const candidateId = input.candidate.candidateId;
    if (!evaluations[candidateId]) {
      evaluations[candidateId] = {
        candidateRef: candidateRefFromCandidate(input.candidate),
        evaluatorOutputs: [],
      };
    }
    evaluations[candidateId].evaluatorOutputs.push(evaluation);
  });

  // run tasks in parallel
  await runParallelBatchesOrThrow(tasks, parallelism);
  return { evaluations: Object.values(evaluations) };
}

/**
 * Evaluates responses for a number of candidates.
 * @category Reflective Prompt Evolution
 * @param state - State of the RPE process.
 * @param responses - Responses to evaluate.
 * @param evaluator - Evaluator to use for the evaluations.
 * @param parallelism - Number of parallel evaluations to run.
 * @returns Evaluations for the responses.
 */
export async function evaluateCandidateResponses(
  state: RPEState,
  responses: RPEExecutorOutput[],
  evaluator: RPEEvaluator,
  parallelism?: number,
): Promise<EvaluatorOutput> {
  const inputs = responses.map(response => ({
    candidate: findCandidateById(state, response.candidateRef.candidateId),
    datasetEntry: response.datasetEntry,
    response: response.response,
    expectedResponse: response.datasetEntry.expectedResponse,
  }));
  return evaluateCandidates(inputs, evaluator, parallelism);
}
