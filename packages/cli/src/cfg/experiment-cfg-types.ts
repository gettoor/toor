import * as z from 'zod';

// see ExperimentDatasetEntry in @gettoor/core
export const ExperimentDatasetEntryScheme = z.object({
  name: z.string().describe('The name of the dataset entry'),
  vars: z
    .record(z.string(), z.any())
    .describe('The variables of the dataset entry'),
});

export type ExperimentDatasetEntry =
  z.infer<typeof ExperimentDatasetEntryScheme>;

export const ExperimentDatasetScheme = z.array(ExperimentDatasetEntryScheme);

export type ExperimentDataset = z.infer<typeof ExperimentDatasetScheme>;

export const ExperimentCfgScheme =
  z.object({
    evaluation: z
      .object({
        type: z
          .enum(['binary', '1-3', '1-5', '1-10'])
          .describe('The evaluation type'),
        model: z
          .string()
          .describe('The model to evaluate'),
        prompt: z
          .string()
          .optional()
          .describe('The prompt to use for the evaluation'),
      })
      .describe('The evaluation configuration'),    
    models: z
      .array(z.object({
        model: z.string().describe('The model to evaluate'),
      }))
      .describe('The models to evaluate'),
    'model-parameters': z
      .array(z.object({
        name: z.string().describe('The name of the model parameter'),
        maxOutputTokens: z
          .number()
          .optional()
          .describe('The maximum number of tokens the model may generate in its response'),
        temperature: z
          .number()
          .min(0)
          .max(1)
          .optional()
          .describe('The temperature of the model parameter'),
        topP: z
          .number()
          .min(0)
          .max(1)
          .optional()
          .describe('The top-p of the model parameter'),
        topK: z
          .number()
          .optional()
          .describe('The top-k of the model parameter'),
        presencePenalty: z
          .number()
          .optional()
          .describe('The presence penalty of the model parameter'),
        frequencyPenalty: z
          .number()
          .optional()
          .describe('The frequency penalty of the model parameter'),
      }))
      .min(1)
      .describe('The model parameters to evaluate'),
    prompts: z
      .array(z.object({
        name: z.string().describe('The name of the prompt'),
        prompt: z.string().describe('The prompt to evaluate'),
      }))
      .describe('The prompts to evaluate'),
    'structured-output': z
      .object({
        schema: z
          .record(z.string(), z.unknown())
          .describe('The schema for structured output'),
        format: z
          .enum(['json', 'yaml'])
          .describe('The format for structured output to evaluate'),
      })
      .optional()
      .describe('The structured output configuration'),
    dataset: z.array(
      z.union([
        z.object({
          file: z.string().describe('The path to the dataset file'),
        })
        .describe('The path to the dataset file'),
        ExperimentDatasetEntryScheme.describe('The dataset entry'),
      ]),
    )
  })
  .strict();

export type ExperimentCfg = z.infer<typeof ExperimentCfgScheme>;
