import { candidateRefFromCandidate } from '../rpe-candidate/index.js';
import {
  RPECandidateGeneratorCandidate,
} from '../rpe-candidate-generator/index.js';
import {
  CandidateGeneratorOutputCandidate,
} from './candidate-generator-types.js';

/**
 * Converts an RPE candidate to a candidate generator output candidate.
 * @category Reflective Prompt Evolution
 * @param rpeCandidate - RPE candidate.
 * @returns Candidate generator output candidate.
 */
export function toCandidateGeneratorOutputCandidate(
  rpeCandidate: RPECandidateGeneratorCandidate,
): CandidateGeneratorOutputCandidate {
  const { candidate, ...description } = rpeCandidate;
  return {
    ...description,
    candidateRef: candidateRefFromCandidate(candidate),
  };
}