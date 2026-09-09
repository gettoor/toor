import { z } from 'zod';

import { ModelParameters } from '../../llm/index.js';
import { ModelProvider } from '../../model-provider/index.js';

/**
 * Instruction how to generate a candidate prompt for the single-prompt
 * RPE candidate generator. One new candidate prompt is generated for each
 * instruction. This is used to generate a diverse set of candidate prompts
 * and to perform exploration.
 * @category Reflective Prompt Evolution
 */
export interface SinglePromptRPECandidateGeneratorInstruction {
  /**
   * Identifier of the instruction.
   */
  id: string;

  /**
   * Instruction how to generate a candidate prompt.
   */
  instruction: string;
}

/**
 * Schema for the candidate generator JSON output used by the single-prompt
 * RPE flow.
 * @category Reflective Prompt Evolution
 */
export const SinglePromptRPECandidateGeneratorOutputSchema = z.object({
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
 * Type for the candidate generator JSON output used by the single-prompt
 * RPE flow.
 * @category Reflective Prompt Evolution
 */
export type SinglePromptRPECandidateGeneratorOutput = z.infer<
  typeof SinglePromptRPECandidateGeneratorOutputSchema
>;

/**
 * Input for the single-prompt RPE candidate generator.
 * @category Reflective Prompt Evolution
 */
export interface SinglePromptRPECandidateGeneratorInput {
  /**
   * Parallelism for the candidate generation.
   */
  parallelism?: number;

  /**
   * Indicates whether to include expected responses and expected response
   * reasoning of failed evaluations.
   * @default true
   */
  includeFailedExpectedResponses?: boolean;

  /**
   * Candidate instructions to use for the candidate generator.
   */
  candidateInstructions?: SinglePromptRPECandidateGeneratorInstruction[];

  /**
   * Model provider to use for the candidate generator.
   * If not provided, the default model provider will be used.
   */
  modelProvider?: ModelProvider;

  /**
   * Model name to use for the candidate generator.
   */
  modelName: string;

  /**
   * Model parameters to use for the candidate generator.
   */
  modelParameters?: ModelParameters;

  /**
   * Prompt to use for the candidate generator. The following placeholders are
   * injected:
   * - `original_prompt` - original prompt,
   * - `aggregated_score` - aggregated overall score (number),
   * - `aggregated_metrics` - aggregated metric scores
   *   (list of name-value pairs with optional reasoning),
   * - `score_distribution` - score distribution,
   * - `strengths` - list of strengths of the original prompt,
   * - `weaknesses` - list of weaknesses of the original prompt,
   * - `recommendations` - list of recommendations for improving
   *    the original prompt,
   * - `failure_patterns` - failure patterns,
   * - `passed_evaluations` - list of explanations of passed evaluations,
   * - `failed_evaluations` - list of explanations of failed evaluations.
   * @default {@link SINGLE_PROMPT_RPE_CANDIDATE_GENERATOR_PROMPT}
   */
  prompt?: string;
}