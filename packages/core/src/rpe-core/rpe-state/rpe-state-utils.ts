import { RPECandidate } from '../rpe-candidate/index.js';
import { CandidateNotFoundError } from './rpe-state-errors.js';
import { RPEState } from './rpe-state-types.js';

/**
 * Finds a candidate by its identifier.
 * @category Reflective Prompt Evolution
 * @param state - State of the RPE process.
 * @param candidateId - Identifier of the candidate to find.
 * @returns Found candidate.
 */
export function findCandidateById(
  state: RPEState,
  candidateId: string,
): RPECandidate {
  const candidate = state.candidates.find(itr => {
    return itr.candidateId === candidateId;
  });
  if (!candidate) {
    throw new CandidateNotFoundError(candidateId);
  }
  return candidate;
}