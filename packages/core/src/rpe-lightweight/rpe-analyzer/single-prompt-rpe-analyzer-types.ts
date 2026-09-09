import { z } from 'zod';

import { ModelParameters } from '../../llm/index.js';
import { ModelProvider } from '../../model-provider/index.js';

/**
 * Schema for the analysis of a failed example (dataset entry).
 * @category Reflective Prompt Evolution
 */
export const SinglePromptRPEAnalyzerFailedExampleAnalysisSchema = z.object({
  response: z
    .string()
    .describe('Response from the model.'),
  expectedResponse: z
    .string()
    .optional()
    .describe('Expected response from the model.'),
  expectedResponseReasoning: z
    .string()
    .optional()
    .describe('Reasoning for why the expected response is correct.'),
  failureReason: z
    .string()
    .describe('What went wrong, not why.'),
  plausibleCause: z
    .string()
    .describe(
      'Why the current prompt plausibly led the model to that failure.',
    ),
  missingConceptualDistinction: z
    .string()
    .describe('Concept the prompt fails to distinguish correctly.'),
  generalRule: z
    .string()
    .describe('Rule that could fix other similar examples.'),
  regressionRisks: z
    .array(z.string())
    .describe(
      'Already-successful behaviors or examples that could become worse ' +
      'if generalRule is applied too broadly.'),
});

/**
 * Schema for the analyzer JSON output used by the single-prompt RPE flow.
 * @category Reflective Prompt Evolution
 */
export const SinglePromptRPEAnalyzerOutputSchema = z.object({
  summary: z
    .object({
      overallAssessment: z
        .string()
        .describe('Short assessment of overall candidate performance.'),
    })
    .describe('High-level summary of strengths and weaknesses.'),
  strengths: z
    .array(
      z.object({
        title: z.string().describe('Short name of the strength.'),
        description: z
          .string()
          .describe('Explanation of why this is a strength.'),
        supportingEvidence: z
          .string()
          .describe('Evidence from evaluations supporting this strength.'),
      }),
    )
    .describe('Detailed list of identified strengths.'),
  failedExampleAnalysis: z
    .array(SinglePromptRPEAnalyzerFailedExampleAnalysisSchema)
    .describe('Detailed analysis of each failed example (dataset entry).'),
  metricAnalysis: z
    .array(
      z.object({
        metric: z.string().describe('Metric name being analyzed.'),
        assessment: z
          .string()
          .describe('Summary of performance for this metric.'),
        possibleCauses: z
          .array(z.string())
          .describe('Likely root causes for this metric result.'),
      }),
    )
    .describe('Per-metric analysis of performance and likely causes.'),
  recommendations: z
    .array(
      z.object({
        priority: z
          .number()
          .describe('Priority order, where 1 is highest priority.'),
        goal: z.string().describe('Optimization goal to address issues.'),
        reason: z
          .string()
          .describe('Rationale for why this goal should improve outcomes.'),
      }),
    )
    .describe('Prioritized optimization goals with rationale.'),
});

/**
 * Type for the analyzer JSON output used by the single-prompt RPE flow.
 * @category Reflective Prompt Evolution
 */
export type SinglePromptRPEAnalyzerOutput = z.infer<
  typeof SinglePromptRPEAnalyzerOutputSchema
>;

/**
 * Input for the single-prompt RPE analyzer.
 * @category Reflective Prompt Evolution
 */
export interface SinglePromptRPEAnalyzerInput {
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

  /**
   * Number of passed evaluations to include in the analysis.
   * @default {@link SINGLE_PROMPT_RPE_ANALYZER_PASSED_EXPLANATIONS_COUNT}
   */
  passedEvaluationsCount?: number;

  /**
   * Number of failed evaluations to include in the analysis.
   * @default {@link SINGLE_PROMPT_RPE_ANALYZER_FAILED_EXAMPLES_COUNT}
   */
  failedEvaluationsCount?: number;

  /**
   * Prompt to use for the analyzer. The following placeholders are injected:
   * - `original_prompt` - original prompt,
   * - `aggregated_score` - aggregated overall score (number),
   * - `aggregated_metrics` - aggregated metric scores
   *   (list of name-value pairs with optional reasoning),
   * - `passed_explanations` - passed evaluations explanations,
   * - `failed_examples` - failed examples (dataset entries).
   * @default {@link SINGLE_PROMPT_RPE_ANALYZER_PROMPT}
   */
  prompt?: string;
}
