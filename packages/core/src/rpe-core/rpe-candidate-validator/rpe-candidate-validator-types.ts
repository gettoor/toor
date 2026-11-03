import { LLMUsage } from '../../llm/index.js';
import { RPECandidate } from "../rpe-candidate/rpe-candidate-types.js";
import { RPEProperties } from "../rpe-info/rpe-info-types.js";

/**
 * Input for the candidate validator.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidateValidatorInput {
  /**
   * Parent candidates from which the candidate to validate was generated.
   */
  parentCandidates: RPECandidate[];
  
  /**
   * Candidate to validate against the parent candidates.
   */
  candidate: RPECandidate;
}

/**
 * Output for the candidate validator.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidateValidatorOutput {
  /**
   * Violations of the validation. A candidate is considered valid if
   * there are no violations.
   */
  violations: string[];

  /**
   * Usage of the candidate validator.
   */
  usage?: LLMUsage;
}

/**
 * Info for the candidate validator.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidateValidatorInfo {
  /**
   * The name of the candidate validator.
   */
  name: string;

  /**
   * Properties of the candidate validator.
   */
  properties?: RPEProperties;  
}

/**
 * Responsible for validating a candidate against the original candidate.
 * Invalid candidates are rejected and not considered for further processing.
 * @category Reflective Prompt Evolution
 */
export interface RPECandidateValidator {
  /**
   * Validate a candidate.
   * @param input - Input for the candidate validator.
   * @returns Output of the candidate validator.
   */
  validate(
    input: RPECandidateValidatorInput,
  ): Promise<RPECandidateValidatorOutput>;

  /**
   * Get the info of the candidate validator.
   * @returns Info of the candidate validator.
   */
  getInfo(): Promise<RPECandidateValidatorInfo>;
}