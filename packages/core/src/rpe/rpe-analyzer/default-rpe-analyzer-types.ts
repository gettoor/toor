import { z } from 'zod';

import { ModelParameters } from '../../llm/index.js';
import { ModelProvider } from '../../model-provider/index.js';

const FrequencyLevelSchema = z
  .enum(['high', 'medium', 'low'])
  .describe('Relative level: high, medium, or low.');

/**
 * Schema for the analyzer JSON output used by the default RPE flow.
 * @category Reflective Prompt Evolution
 */
export const DefaultRPEAnalyzerOutputSchema = z.object({
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
  weaknesses: z
    .array(
      z.object({
        title: z.string().describe('Short name of the weakness.'),
        description: z
          .string()
          .describe('Explanation of why this is a weakness.'),
        supportingEvidence: z
          .string()
          .describe('Evidence from evaluations supporting this weakness.'),
      }),
    )
    .describe('Detailed list of identified weaknesses.'),    
  failurePatterns: z
    .array(
      z.object({
        title: z.string().describe('Short name of the failure pattern.'),
        description: z
          .string()
          .describe('Explanation of recurring failure behavior.'),
        frequency: FrequencyLevelSchema.describe(
          'How often this pattern appears.',
        ),
        impact: FrequencyLevelSchema.describe(
          'How much this pattern harms results.',
        ),
        supportingEvidence: z
          .string()
          .describe('Evidence from evaluations supporting this pattern.'),
      }),
    )
    .describe('Recurring failure patterns with severity and impact.'),
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
 * Type for the analyzer JSON output used by the default RPE flow.
 * @category Reflective Prompt Evolution
 */
export type DefaultRPEAnalyzerOutput = z.infer<
  typeof DefaultRPEAnalyzerOutputSchema
>;

/**
 * Input for the default RPE analyzer.
 * @category Reflective Prompt Evolution
 */
export interface DefaultRPEAnalyzerInput {
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
   */
  passedEvaluationsCount?: number;

  /**
   * Number of failed evaluations to include in the analysis.
   */
  failedEvaluationsCount?: number;
}
