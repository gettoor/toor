import * as z from 'zod';
import { ModelParametersScheme } from '../../llm/index.js';

export const RPEDatasetValidationCfgDatasetsScheme = z.object({
  file: z.string().describe('The path to the dataset file'),
});

export const RPEDatasetValidationCfgScheme =
  z.object({
    datasets: z
      .record(z.string(), RPEDatasetValidationCfgDatasetsScheme)
      .describe('The datasets to validate'),
    additionalContext: z
      .string()
      .describe(
        'The additional context to use for validation. It should describe' +
        'the datasets and how the variables in the dataset entries are used ' +
        'to generate responses.'
      ),
    modelName: z
      .string()
      .describe('The name of the LLM model to use for validation'),
    embeddingsModelName: z
      .string()
      .describe('The name of the embeddings model to use for validation'),
    modelParameters: ModelParametersScheme
      .optional()
      .describe('The parameters to use for the LLM model'),
    expectedResponseDistributionImbalanceThreshold: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe(
        'The threshold for expected response distribution imbalance.' +
        'Between 0 and 1. 0 means perfect distribution, 1 means worst ' +
        'distribution. Default is 0.5.'
      ),
  })
  .strict();
  
export type RPEDatasetValidationCfg =
  z.infer<typeof RPEDatasetValidationCfgScheme>;