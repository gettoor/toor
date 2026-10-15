import { z } from 'zod';

/**
 * Scheme for a expected response.
 */
export const RPEDatasetEntryExpectedResponseScheme = z.object({
  response: z
    .union([
      z.record(z.string(), z.any()),
      z.string(),
    ])
    .describe('Expected response from a LLM model to the candidate.'),
  reasoning: z
    .string()
    .optional()
    .describe('Reasoning for why the expected response is correct.'),
});

/**
 * Schema for a dataset entry.
 */
export const RPEDatasetEntrySchema = z
  .object({
    id: z
      .string()
      .describe('Unique identifier of the dataset entry.'),
    vars: z
      .record(z.string(), z.any())
      .describe('Variables to replace in the candidate.'),
    'expected-response': RPEDatasetEntryExpectedResponseScheme
      .optional()
      .describe('Expected response from a LLM model to the candidate.'),
  })
  .strict();

/**
 * Schema for a dataset.
 */
export const RPEDatasetSchema = z.object({
  entries: z
    .array(RPEDatasetEntrySchema)
    .describe('Entries in the dataset.'),
});

/**
 * Type for a dataset for IO.
 */
export type RPEDatasetForIO = z.infer<typeof RPEDatasetSchema>;