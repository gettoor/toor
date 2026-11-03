import { objectToRPEPropertyValue } from '../rpe-info/index.js';
import { 
  RPECandidateValidator,
  RPECandidateValidatorInput,
} from './rpe-candidate-validator-types.js';
import { 
  CompositeRPECandidateValidatorInput,
} from './composite-rpe-candidate-validator-types.js';

/**
 * A composite candidate validator that runs multiple candidate validators
 * and returns the violations.
 * @category Reflective Prompt Evolution
 * @param input - Input for the composite candidate validator.
 * @returns - All the violations from the candidate validators.
 */
export function compositeRPECandidateValidator(
  input: CompositeRPECandidateValidatorInput,
): RPECandidateValidator {
  const { validators } = input;

  return {
    validate: async (input: RPECandidateValidatorInput) => {
      const allViolations: string[] = [];

      // run all validators and collect violations
      for (const validator of validators) {
        const { violations } = await validator.validate(input);
        if (violations.length > 0) {
          allViolations.push(...violations);
        }
      }

      return { violations: allViolations };
    },

    getInfo: async () => {
      const rawValidatorInfos = await Promise.all(
        validators.map(validator => validator.getInfo()),
      );
      const validatorInfos = rawValidatorInfos.map((info, index) => {
        return [
          {
            key: `validator-${index}-name`,
            value: info.name,
          },
          {
            key: `validator-${index}-properties`,
            value: objectToRPEPropertyValue(info.properties),
          }
        ];
      });
      return {
        name: 'Composite Candidate Validator',
        properties: [
          ...validatorInfos.flat(),
        ],
      };
    },
  };
}