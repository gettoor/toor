import { RPECandidateValidator } from './rpe-candidate-validator-types.js';

/**
 * Input for the composite RPE candidate validator.
 * @category Reflective Prompt Evolution
 */
export interface CompositeRPECandidateValidatorInput {
  /**
   * Validators to run in sequence.
   */
  validators: RPECandidateValidator[];
}