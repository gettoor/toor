import { InternalToorError } from '../../errors/index.js';
import { countPlaceholders, findUniquePlaceholders } from '../../string/index.js';
import { 
  RPECandidateValidator,
  RPECandidateValidatorInput,
  RPECandidateValidatorOutput,
} from './rpe-candidate-validator-types.js';
import { 
  placeholdersRPECandidateValidator,
} from './placeholders-rpe-candidate-validator.js';
import {
  ExactPlaceholdersRPECandidateValidatorInput,
} from './exact-placeholders-rpe-candidate-validator-types.js';
import { RPEProperty } from '../rpe-info/index.js';

export function exactPlaceholdersRPECandidateValidator(
  input: ExactPlaceholdersRPECandidateValidatorInput,
): RPECandidateValidator {
  const {
    validPlaceholders,
    validPlaceholdersPerModule,
    rejectDuplicates = true,
  } = input;
  if (!validPlaceholders && !validPlaceholdersPerModule) {
    throw new InternalToorError(
      'No valid placeholders or valid placeholders per module provided',
    );
  }

  const findMissingPlaceholders = (
    text: string,
    placeholders: string[],
  ): string[] => {
    const placeholdersFound = findUniquePlaceholders(text);
    return placeholders.filter(placeholder => {
      return !placeholdersFound.includes(placeholder);
    });
  };

  const findExtraPlaceholders = (
    text: string,
    placeholders: string[],
  ): string[] => {
    const placeholdersFound = findUniquePlaceholders(text);
    return placeholdersFound.filter(placeholder => {
      return !placeholders.includes(placeholder);
    });
  };

  const validate = async (
    input: RPECandidateValidatorInput,
    candidatePlaceholdersPerModule: Record<string, string[]>,
  ): Promise<Pick<RPECandidateValidatorOutput, 'violations'>> => {
    const violations: string[] = [];
    const moduleKeys = Object.keys(candidatePlaceholdersPerModule);

    if (validPlaceholders) {
      moduleKeys.forEach(moduleKey => {
        const module = input.candidate.modules[moduleKey];

        // missing placeholders
        const missingPlaceholders = findMissingPlaceholders(
          module.content,
          validPlaceholders,
        );
        if (missingPlaceholders.length > 0) {
          violations.push(
            `Module ${moduleKey} is missing the following ` +
            `placeholders: ${missingPlaceholders.join(', ')}`,
          );
        }

        // extra placeholders
        const extraPlaceholders = findExtraPlaceholders(
          module.content,
          validPlaceholders,
        );
        if (extraPlaceholders.length > 0) {
          violations.push(
            `Module ${moduleKey} has the following extra ` +
            `placeholders: ${extraPlaceholders.join(', ')}`,
          );
        }
      });
    }

    if (validPlaceholdersPerModule) {
      moduleKeys.forEach(moduleKey => {
        const module = input.candidate.modules[moduleKey];
        const validPlaceholders = validPlaceholdersPerModule[moduleKey];
        if (!validPlaceholders) {
          return;
        }

        // missing placeholders
        const missingPlaceholders = findMissingPlaceholders(
          module.content,
          validPlaceholders,
        );
        if (missingPlaceholders.length > 0) {
          violations.push(
            `Module ${moduleKey} is missing the following ` +
            `placeholders: ${missingPlaceholders.join(', ')}`,
          );
        }

        // extra placeholders
        const extraPlaceholders = findExtraPlaceholders(
          module.content,
          validPlaceholders,
        );
        if (extraPlaceholders.length > 0) {
          violations.push(
            `Module ${moduleKey} has the following extra ` +
            `placeholders: ${extraPlaceholders.join(', ')}`,
          );
        }
      });
    }

    if (rejectDuplicates) {
      moduleKeys.forEach(moduleKey => {
        const module = input.candidate.modules[moduleKey];
        const counts = countPlaceholders(module.content);
        const duplicates = Object.entries(counts)
          .filter(([_, count]) => count > 1)
          .map(([placeholder]) => placeholder);

        // duplicated placeholders
        if (duplicates.length > 0) {
          violations.push(
            `Module ${moduleKey} has the following duplicated placeholders: `+
            `${duplicates.join(', ')}`,
          );
        }
      });
    }

    return { violations };
  };

  return placeholdersRPECandidateValidator({
    validator: {
      name: 'Exact Placeholders Candidate Validator',
      properties: [
        ...(validPlaceholders
          ? [validPlaceholdersProperty(validPlaceholders)]
          : []
        ),
        ...(validPlaceholdersPerModule
          ? [ validPlaceholdersPerModuleProperty(validPlaceholdersPerModule) ]
          : []
        ),
      ],
      validate,
    },
  });
}

function validPlaceholdersProperty(validPlaceholders: string[]): RPEProperty {
  return {
    key: 'validPlaceholders',
    value: validPlaceholders.join(', '),
    description: 'Placeholders validated across all modules of the candidate.',
  };
}

function validPlaceholdersPerModuleProperty(
  validPlaceholdersPerModule: Record<string, string[]>,
): RPEProperty {
  const modules = Object.keys(validPlaceholdersPerModule);
  const value = modules
    .map(module => {
      return `${module}: ${validPlaceholdersPerModule[module].join(' | ')}`;
    })
    .join(', ');
  return {
    key: 'validPlaceholdersPerModule',
    value,
    description: 'Placeholders validated per module of the candidate.',
  };
}