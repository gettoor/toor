import { z } from 'zod';

/**
 * The schema for the insufficient information validator output.
 */
export const InsufficientInformationOutputSchema = z.object({
  hasSufficientInformation: z
    .boolean()
    .describe(
      'Whether the dataset entry has insufficient information',
    ),
  reasoning: z
    .string()
    .describe(
      'Brief explanation why the dataset entry has insufficient information.'
    ),
  confidence: z
    .number()
    .min(0.0)
    .max(1.0)
    .describe(
      'Confidence that the dataset entry has insufficient information, ' +
      'from 0.0 to 1.0.'
    ),
  insufficientFields: z
    .array(z.string())
    .describe(
      'The names of fields that are insufficient. ' +
      'Omit this field for string expected responses.'
    ),
});

/**
 * The type of the insufficient information validator output.
 */
export type InsufficientInformationOutput =
  z.infer<typeof InsufficientInformationOutputSchema>;