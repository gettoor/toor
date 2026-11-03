import { InternalToorError } from '../../errors/index.js';
import { RPECandidate } from '../rpe-candidate/index.js';
import { RPECandidateValidatorInput } from './rpe-candidate-validator-types.js';
import { exactPlaceholdersRPECandidateValidator } from './exact-placeholders-rpe-candidate-validator.js';

function createCandidate(
  modules: Record<string, string>,
  candidateId = 'candidate-1',
): RPECandidate {
  return {
    candidateId,
    modules: Object.fromEntries(
      Object.entries(modules).map(([key, content]) => [key, { content }]),
    ),
  };
}

function createInput(
  modules: Record<string, string>,
  parentCandidates: RPECandidate[] = [],
): RPECandidateValidatorInput {
  return {
    parentCandidates,
    candidate: createCandidate(modules),
  };
}

describe('exactPlaceholdersRPECandidateValidator', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('construction', () => {
    it('throws when neither placeholder list is provided', () => {
      expect(() => exactPlaceholdersRPECandidateValidator({}))
        .toThrow(InternalToorError);
      expect(() => exactPlaceholdersRPECandidateValidator({}))
        .toThrow(
          'No valid placeholders or valid placeholders per module provided',
        );
    });
  });

  describe('validPlaceholders', () => {
    it('reports no violations when every module has exactly those placeholders', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input', 'context'],
      });

      const output = await validator.validate(createInput({
        system: 'Use {{context}} to answer {{input}}.',
        user: '{{input}} with {{context}}',
      }));

      expect(output).toEqual({ violations: [] });
    });

    it('reports missing placeholders in the order of the valid list', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['context', 'input', 'tone'],
      });

      const output = await validator.validate(createInput({
        prompt: 'Answer {{input}}.',
      }));

      expect(output.violations).toEqual([
        'Module prompt is missing the following placeholders: context, tone',
      ]);
    });

    it('reports extra placeholders in the order they appear', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input'],
      });

      const output = await validator.validate(createInput({
        prompt: '{{tone}} for {{input}} using {{context}}',
      }));

      expect(output.violations).toEqual([
        'Module prompt has the following extra placeholders: tone, context',
      ]);
    });

    it('reports missing and extra placeholders for the same module', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input', 'context'],
      });

      const output = await validator.validate(createInput({
        prompt: 'Answer {{input}} in {{tone}}.',
      }));

      expect(output.violations).toEqual([
        'Module prompt is missing the following placeholders: context',
        'Module prompt has the following extra placeholders: tone',
      ]);
    });

    it('checks every module of the candidate', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input'],
      });

      const output = await validator.validate(createInput({
        system: 'No placeholders here.',
        user: '{{input}} and {{tone}}',
      }));

      expect(output.violations).toEqual([
        'Module system is missing the following placeholders: input',
        'Module user has the following extra placeholders: tone',
      ]);
    });

    it('treats an empty list as forbidding every placeholder', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: [],
      });

      const output = await validator.validate(createInput({
        prompt: 'Hello {{name}}.',
      }));

      expect(output.violations).toEqual([
        'Module prompt has the following extra placeholders: name',
      ]);
    });

    it('reports no violations when the candidate has no modules', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input'],
      });

      const output = await validator.validate(createInput({}));

      expect(output).toEqual({ violations: [] });
    });

    it('ignores placeholders in parent candidates', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input'],
      });

      const output = await validator.validate(createInput(
        { prompt: 'Answer {{input}}.' },
        [createCandidate({ prompt: 'Missing the required placeholder.' }, 'parent')],
      ));

      expect(output).toEqual({ violations: [] });
    });

    it('matches placeholders after trimming whitespace inside the braces', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input'],
      });

      const output = await validator.validate(createInput({
        prompt: 'Answer {{ input }}.',
      }));

      expect(output).toEqual({ violations: [] });
    });
  });

  describe('validPlaceholdersPerModule', () => {
    it('reports no violations when each module matches its own list', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholdersPerModule: {
          system: ['role'],
          user: ['input', 'context'],
        },
      });

      const output = await validator.validate(createInput({
        system: 'You are a {{role}}.',
        user: '{{context}}: {{input}}',
      }));

      expect(output).toEqual({ violations: [] });
    });

    it('reports missing and extra placeholders against the module list', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholdersPerModule: {
          system: ['role'],
          user: ['input'],
        },
      });

      const output = await validator.validate(createInput({
        system: 'You are a helpful assistant.',
        user: '{{input}} about {{topic}}',
      }));

      expect(output.violations).toEqual([
        'Module system is missing the following placeholders: role',
        'Module user has the following extra placeholders: topic',
      ]);
    });

    it('does not require a configured module that the candidate omits', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholdersPerModule: {
          system: ['role'],
          user: ['input'],
        },
      });

      const output = await validator.validate(createInput({
        user: 'Answer {{input}}.',
      }));

      expect(output).toEqual({ violations: [] });
    });

    it('formats the per-module property from each module list', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholdersPerModule: {
          system: ['role'],
          user: ['input', 'context'],
        },
      });

      await expect(validator.getInfo()).resolves.toEqual({
        name: 'Placeholders Candidate Validator',
        properties: [
          {
            key: 'validator',
            value: 'Exact Placeholders Candidate Validator',
            description: 'The name of the validator.',
          },
          {
            key: 'validPlaceholdersPerModule',
            value: 'system: role, user: input | context',
            description: 'Placeholders validated per module of the candidate.',
          },
        ],
      });
    });
  });

  describe('both placeholder lists', () => {
    it('applies the global list and the per-module list independently', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input'],
        validPlaceholdersPerModule: {
          prompt: ['input', 'context'],
        },
      });

      const output = await validator.validate(createInput({
        prompt: '{{input}} {{context}} {{tone}}',
      }));

      expect(output.violations).toEqual([
        'Module prompt has the following extra placeholders: context, tone',
        'Module prompt has the following extra placeholders: tone',
      ]);
    });
  });

  describe('rejectDuplicates', () => {
    it('rejects duplicated placeholders by default', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input', 'context'],
      });

      const output = await validator.validate(createInput({
        prompt: '{{input}} and {{context}} then {{input}} again',
      }));

      expect(output.violations).toEqual([
        'Module prompt has the following duplicated placeholders: input',
      ]);
    });

    it('reports every duplicated placeholder in order of first appearance', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input', 'context'],
        rejectDuplicates: true,
      });

      const output = await validator.validate(createInput({
        prompt: '{{context}} {{input}} {{context}} {{input}}',
      }));

      expect(output.violations).toEqual([
        'Module prompt has the following duplicated placeholders: context, input',
      ]);
    });

    it('allows duplicates when rejectDuplicates is false', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input'],
        rejectDuplicates: false,
      });

      const output = await validator.validate(createInput({
        prompt: '{{input}} {{input}}',
      }));

      expect(output).toEqual({ violations: [] });
    });

    it('still reports missing and extra placeholders when duplicates are allowed', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input', 'context'],
        rejectDuplicates: false,
      });

      const output = await validator.validate(createInput({
        prompt: '{{input}} {{input}} {{tone}}',
      }));

      expect(output.violations).toEqual([
        'Module prompt is missing the following placeholders: context',
        'Module prompt has the following extra placeholders: tone',
      ]);
    });

    it('reports duplicates after placeholder-set violations', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input', 'context'],
      });

      const output = await validator.validate(createInput({
        prompt: '{{input}} {{input}}',
      }));

      expect(output.violations).toEqual([
        'Module prompt is missing the following placeholders: context',
        'Module prompt has the following duplicated placeholders: input',
      ]);
    });

    it('counts trimmed placeholders as the same placeholder', async () => {
      const validator = exactPlaceholdersRPECandidateValidator({
        validPlaceholders: ['input'],
      });

      const output = await validator.validate(createInput({
        prompt: '{{input}} and {{ input }}',
      }));

      expect(output.violations).toEqual([
        'Module prompt has the following duplicated placeholders: input',
      ]);
    });
  });
});
