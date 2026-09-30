import { z } from 'zod';

/**
 * The schema for the contradictions validator output.
 */
export const ContradictionsOutputSchema = z.object({
  areInputsEquivalentForTask: z
    .boolean()
    .describe(
      'Whether the inputs are equivalent for the task.'
    ),
  isContradiction: z
    .boolean()
    .describe(
      'Whether the examples contradict each other.'
    ),
  conflictingFields: z
    .array(z.string())
    .optional()
  .describe(
    'The names of fields containing contradictory expected values. ' +
    'Omit this field for string expected responses.'
  ),
  confidence: z
    .number()
    .min(0.0)
    .max(1.0)
    .describe(
      'Confidence that the examples either do or do not constitute ' +
      'a contradiction, from 0.0 to 1.0.'
    ),
  reasoning: z.string()
    .describe(
      'Brief explanation why the inputs are or are not equivalent for ' +
      'the task and why the expected responses are or are not contradictory.'
    ),
});

/**
 * The type of the contradictions validator output.
 */
export type ContradictionsOutput = z.infer<typeof ContradictionsOutputSchema>;