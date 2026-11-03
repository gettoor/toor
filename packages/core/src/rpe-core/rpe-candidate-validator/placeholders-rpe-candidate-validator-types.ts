import { RPEProperty } from '../rpe-info/index.js';
import { 
  RPECandidateValidatorInput,
  RPECandidateValidatorOutput,
} from './rpe-candidate-validator-types.js';

export interface PlaceholdersRPECandidateValidatorFunc {
  /**
   * Name of the validator.
   */
  name: string;

  /**
   * Properties of the validator.
   */
  properties?: RPEProperty[];

  /**
   * Function to validate the placeholders of a candidate.
   * @param input - Input for the candidate validator.
   * @param candidatePlaceholdersPerModule - Candidate placeholders per module.
   * @returns Output of the validation.
   */
  validate: (
    input: RPECandidateValidatorInput,
    candidatePlaceholdersPerModule: Record<string, string[]>,
  ) => Promise<Pick<RPECandidateValidatorOutput, 'violations'>>;
}

export interface PlaceholdersRPECandidateValidatorInput {
  /**
   * Function to validate the placeholders of a candidate.
   */
  validator: PlaceholdersRPECandidateValidatorFunc;
}