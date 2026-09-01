import { RPECandidate, RPECandidateRef } from './rpe-candidate-types.js';

/**
 * Creates a reference to a candidate.
 * @category Reflective Prompt Evolution
 * @param candidate - Candidate to create a reference for.
 * @returns Reference to the candidate.
 */
export function candidateRefFromCandidate(candidate: RPECandidate): RPECandidateRef {
  return {
    candidateId: candidate.candidateId,
  }
}