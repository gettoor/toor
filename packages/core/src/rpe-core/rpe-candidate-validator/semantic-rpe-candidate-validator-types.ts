import { z } from 'zod';

import { ModelParameters } from '../../llm/index.js';
import { ModelProvider } from '../../model-provider/index.js';

export const SemanticRPECandidateValidatorViolationSchema = 
  z.object({
    module: z
      .string()
      .describe(
        'The name of the candidate module containing the violation. ' +
        'Leave empty when the violation concerns multiple modules ' +
        'or a requirement missing from the entire candidate.'
      ),
    requirement: z
      .string()
      .describe(
        'The identifier or concise description ' +
        'of the violated contract requirement.',
      ),
    evidence: z
      .string()
      .describe(
        'The exact candidate instruction demonstrating the violation. ' +
        'For missing requirements, state that the required instruction is ' +
        'absent from the candidate modules. For contradictions spanning ' +
        'multiple modules, include the relevant instructions ' +
        'and their module names.'
      ),
      reasoning: z
      .string()
      .describe(
        'A concise explanation of how the candidate violates the contract.'
      ),
  })
  .strict();

export const SemanticRPECandidateValidatorSchema =
  z.object({
    valid: z
      .boolean()
      .describe('True if no contract violations are detected; otherwise false.'),
    violations: z
      .array(SemanticRPECandidateValidatorViolationSchema)
      .describe(
        'An array of contract violations. ' +
        'Return an empty array when the candidate is valid.'
      ),
  })
  .strict();

export interface SemanticRPECandidateValidatorInput {
  /**
   * Contract to validate.
   */
  contract: string;

  /**
   * Model provider to use for the semantic candidate validator.
   * If not provided, the default model provider will be used.
   */
  modelProvider?: ModelProvider;

  /**
   * Model name to use.
   */
  modelName: string;

  /**
   * Model parameters to use.
   */
  modelParameters?: ModelParameters;  
}