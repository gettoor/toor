import { 
  RPECandidateGeneratorCandidate,
} from '../rpe-candidate-generator/index.js';
import { RPECandidateValidator } from '../rpe-candidate-validator/index.js';
import { RPECandidateRef } from '../rpe-candidate/index.js';

export interface RPERejectedCandidateRef {
  /**
   * Reference to the candidate.
   */
  candidateRef: RPECandidateRef;

  /**
   * Reason for the rejection.
   */
  reason: string;
}

export interface ValidateCandidateInput {
  /**
   * Candidates to validate.
   */
  candidates: RPECandidateGeneratorCandidate[];

  /**
   * Candidate validator to use.
   */
  candidateValidator?: RPECandidateValidator;

  /**
   * Parallelism to use for validating candidates.
   */
  parallelism?: number;

  /**
   * Called when candidates are being validated.
   */
  validatingCandidates?: () => Promise<void>;

  /**
   * Called when candidates have been validated.
   */
  candidatesValidated?: (
    validCandidates: RPECandidateGeneratorCandidate[],
    rejectedCandidates: RPERejectedCandidateRef[],
  ) => Promise<void>;
}
export interface ValidateCandidatesOutput {
  /**
   * Candidates that passed the validation.
   */
  validCandidates: RPECandidateGeneratorCandidate[];

  /**
   * Candidates that failed the validation.
   */
  rejectedCandidates: RPERejectedCandidateRef[];
}