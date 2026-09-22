import { RPECandidate } from '../rpe-candidate/index.js';
import {
  CandidateNotFoundError,
  GeneratedCandidateNotFoundError,
} from './rpe-state-errors.js';
import { CandidateGeneratorOutputCandidate } from '../rpe-process/index.js';
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

/**
 * Finds a generated candidate by its identifier.
 * @category Reflective Prompt Evolution
 * @param state - State of the RPE process.
 * @param candidateId - Identifier of the candidate to find.
 * @returns Generated candidate.
 */
export function findGeneratedCandidateById(
  state: RPEState,
  candidateId: string,
): CandidateGeneratorOutputCandidate {
  const allGeneratedCandidates = state.iterationHistory.flatMap(itr => {
    return itr.generatedCandidates ?? [];
  });
  const candidate = allGeneratedCandidates.find(itr => {
    return itr.candidateRef.candidateId === candidateId;
  });
  if (!candidate) {
    throw new GeneratedCandidateNotFoundError(candidateId);
  }
  return candidate;
}

/**
 * Finds all ancestors of a candidate.
 * @category Reflective Prompt Evolution
 * @param state - State of the RPE process.
 * @param candidateId - Identifier of the candidate to find ancestors for.
 * @returns Ancestors of the candidate.
 */
export function findCandidateAncestorsById(
  state: RPEState,
  candidateId: string,
): RPECandidate[] {
  const ancestors: RPECandidate[] = [];

  const visited = new Set<string>();
  // collect ancestors for a candidate and all its parents
  function collectAncestors(candidate: RPECandidate) {
    if (!candidate.parentCandidateIds) {
      return;
    }
    for (const parentId of candidate.parentCandidateIds) {
      if (visited.has(parentId)) {
        continue;
      }
      visited.add(parentId);
      const parent = findCandidateById(state, parentId);
      ancestors.push(parent);
      collectAncestors(parent);
    }
  }

  // start with the candidate itself
  collectAncestors(findCandidateById(state, candidateId));

  return ancestors;
}