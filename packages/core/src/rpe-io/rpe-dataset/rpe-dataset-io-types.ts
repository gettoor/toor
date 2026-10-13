import { z } from 'zod';

/**
 * Schema for a dataset entry.
 */
export const RPEDatasetEntrySchema = z.object({
  id: z
    .string()
    .describe('Unique identifier of the dataset entry.'),

  vars: z
    .record(z.string(), z.any())
    .describe('Variables to replace in the candidate.'),

  expectedResponse: z
    .string()
    .optional()
    .describe('Expected response from a LLM model to the candidate.'),

  expectedResponseReasoning: z
    .string()
    .optional()
    .describe('Reasoning for why the expected response is correct.'),
})
.refine(
  (data) =>
    data.expectedResponseReasoning === undefined ||
    data.expectedResponse !== undefined,
  {
    message: 'expectedResponse is required when expectedResponseReasoning is set.',
    path: ['expectedResponse'],
  },
);

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