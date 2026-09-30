import { z } from 'zod';

/**
 * The schema for the likely incorrect expected response validator output.
 */
export const LikelyIncorrectExpectedResponseOutputSchema = z.object({
  isExpectedResponseCorrect: z
    .boolean()
    .describe(
      'Whether the expected response is correct.'
    ),
  reasoning: z
    .string()
    .describe(
      'Brief explanation why the expected response is correct or incorrect.'
    ),
  confidence: z
    .number()
    .min(0.0)
    .max(1.0)
    .describe(
      'Confidence that the expected response is correct, from 0.0 to 1.0.'
    ),
});

/**
 * The type of the likely incorrect expected response validator output.
 */
export type LikelyIncorrectExpectedResponseOutput =
  z.infer<typeof LikelyIncorrectExpectedResponseOutputSchema>;