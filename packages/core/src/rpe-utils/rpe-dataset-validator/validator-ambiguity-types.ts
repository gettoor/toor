import { z } from 'zod';

/**
 * The schema for the ambiguity validator output.
 */
export const AmbiguityOutputSchema = z.object({
  isAmbiguous: z
    .boolean()
    .describe('Whether the dataset entry is ambiguous.'),
  reasoning: z
    .string()
    .describe('The reasoning for the ambiguity.'),
  confidence: z
    .number()
    .min(0.0)
    .max(1.0)
    .describe('The confidence in the ambiguity. From 0.0 to 1.0.'),
  alternativeResponses: z
    .array(z.any())
    .describe('The alternative responses for the ambiguity.'),
  ambiguousFields: z
    .array(z.string())
    .describe('The fields that are ambiguous.'),
});

/**
 * The type of the ambiguity validator output.
 */
export type AmbiguityOutput = z.infer<typeof AmbiguityOutputSchema>;