import { findUniquePlaceholders } from '../../string/index.js';
import { 
  RPECandidateValidator,
  RPECandidateValidatorInput,
} from './rpe-candidate-validator-types.js';
import {
  PlaceholdersRPECandidateValidatorInput,
} from './placeholders-rpe-candidate-validator-types.js';

export function placeholdersRPECandidateValidator(
  input: PlaceholdersRPECandidateValidatorInput,
): RPECandidateValidator {
  const { validator } = input;

  return {
    validate: async (input: RPECandidateValidatorInput) => {
      // placeholders per module
      const candidatePlaceholdersPerModule: Record<string, string[]> = {};
      for (const module in input.candidate.modules) {
        candidatePlaceholdersPerModule[module] = findUniquePlaceholders(
          input.candidate.modules[module].content
        );
      }

      // validate
      const { violations } = await validator.validate(
        input,
        candidatePlaceholdersPerModule,
      );

      return { violations };
    },

    getInfo: async () => {
      return {
        name: 'Placeholders Candidate Validator',
        properties: [
          {
            key: 'validator',
            value: validator.name,
            description: 'The name of the validator.',
          },
          ...(validator.properties ?? []),
        ],
      };
    },
  };
}