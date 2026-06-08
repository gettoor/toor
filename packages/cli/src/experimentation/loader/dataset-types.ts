import * as z from 'zod';

export const ExperimentDatasetScheme = z.array(
  z.object({
    name: z.string().describe('The name of the dataset entry'),
    vars: z
      .record(z.string(), z.any())
      .describe('The variables of the dataset entry'),
  }),
);

export type ExperimentDataset = z.infer<typeof ExperimentDatasetScheme>;