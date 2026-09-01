import { z } from 'zod';

import { ModelParameters } from '../../llm/index.js';
import { ModelProvider } from '../../model-provider/index.js';

/**
 * Schema for the candidate generator JSON output used by the default RPE flow.
 * @category Reflective Prompt Evolution
 */
export const DefaultRPECandidateGeneratorOutputSchema = z.object({
  prompt: z.string().describe('Improved prompt.'),
  changes: z
    .array(
      z.object({
        description: z
          .string()
          .describe('Brief description of the change made to the prompt.'),
        reasoning: z
          .string()
          .describe('Why this change improves the prompt.'),
      }),
    )
    .describe('List of prompt changes and rationale.'),
});

/**
 * Type for the candidate generator JSON output used by the default RPE flow.
 * @category Reflective Prompt Evolution
 */
export type DefaultRPECandidateGeneratorOutput = z.infer<
  typeof DefaultRPECandidateGeneratorOutputSchema
>;

export interface DefaultRPECandidateGeneratorInput {
  /**
   * Model provider to use for the analyzer.
   * If not provided, the default model provider will be used.
   */
  modelProvider?: ModelProvider;

  /**
   * Model name to use for the analyzer.
   */
  modelName: string;

  /**
   * Model parameters to use for the analyzer.
   */
  modelParameters?: ModelParameters;
}