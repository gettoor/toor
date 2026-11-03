import { 
  placeholdersRPECandidateValidator,
} from './placeholders-rpe-candidate-validator.js';
import { 
  RPECandidateValidator,
  RPECandidateValidatorInput,
  RPECandidateValidatorOutput,
} from './rpe-candidate-validator-types.js';
import {
  NoPlaceholdersRPECandidateValidatorInput,
} from './no-placeholders-rpe-candidate-validator-types.js';

/**
 * Validates that a candidate does not have placeholders in
 * the specified modules.
 * @category Reflective Prompt Evolution
 * @param input - Input for the no placeholders RPE candidate validator.
 * @returns No placeholders RPE candidate validator.
 */
export function noPlaceholdersRPECandidateValidator(
  input: NoPlaceholdersRPECandidateValidatorInput,
): RPECandidateValidator {
  const { modulesWithoutPlaceholders } = input;

  const validate = async (
    input: RPECandidateValidatorInput,
    candidatePlaceholdersPerModule: Record<string, string[]>,
  ): Promise<Pick<RPECandidateValidatorOutput, 'violations'>> => {
    const violations: string[] = [];
  
    Object.keys(candidatePlaceholdersPerModule).forEach(moduleKey => {
      const modulePlaceholders = candidatePlaceholdersPerModule[moduleKey];
      const hasPlaceholders = modulePlaceholders.length > 0;

      const forbidden = modulesWithoutPlaceholders.includes(moduleKey);
      if (forbidden && hasPlaceholders) {
        violations.push(
          `Module ${moduleKey} is forbidden to have placeholders`,
        );
      }
    });

    return { violations };
  };

  return placeholdersRPECandidateValidator({
    validator: {
      name: 'No Placeholders Candidate Validator',
      validate,
    },
  });
}