import { runParallelBatchesOrThrow } from '../../concurrency/index.js';
import { candidateRefFromCandidate } from '../rpe-candidate/index.js';
import { RPEState, findCandidateById } from '../rpe-state/index.js';
import {
  RPECandidateGeneratorCandidate,
} from '../rpe-candidate-generator/index.js';
import { 
  DEFAULT_CANDIDATE_VALIDATOR_PARALLELISM,
} from './candidate-validator-consts.js';
import { 
  RPERejectedCandidateRef,
  ValidateCandidateInput,
  ValidateCandidatesOutput,
} from './candidate-validator-types.js';

export async function validateCandidates(
  state: RPEState,
  input: ValidateCandidateInput,
): Promise<ValidateCandidatesOutput> {
  const { 
    candidates,
    candidateValidator,
    parallelism = DEFAULT_CANDIDATE_VALIDATOR_PARALLELISM,
  } = input;

  // all candidate considered valid if no validator is provided
  if (!candidateValidator) {
    return {
      validCandidates: candidates,
      rejectedCandidates: [],
    };
  }

  // notify
  await input.validatingCandidates?.();

  const validCandidates: RPECandidateGeneratorCandidate[] = [];
  const rejectedCandidates: RPERejectedCandidateRef[] = [];

  // tasks
  const tasks = candidates.map(async candidate => {
    const parentCandidateIds = candidate.candidate.parentCandidateIds ?? [];
    const parentCandidates = parentCandidateIds.map(
      parentCandidateId => findCandidateById(state, parentCandidateId)
    );
    const output = await candidateValidator.validate({
      parentCandidates,
      candidate: candidate.candidate,
    });
    if (output.violations.length === 0) {
      validCandidates.push(candidate);
    }
    else {
      rejectedCandidates.push({
        candidateRef: candidateRefFromCandidate(candidate.candidate),
        reason: output.violations.join('\n'),
      });
    }
  });

  // run tasks in parallel
  await runParallelBatchesOrThrow(tasks, parallelism);
  await input.candidatesValidated?.(validCandidates, rejectedCandidates);

  return { validCandidates, rejectedCandidates };
}