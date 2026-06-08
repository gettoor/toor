import * as z from 'zod';

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
        temperature: z
          .number()
          .min(0)
          .max(1)
          .optional()
          .describe('The temperature of the model parameter'),
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
    datasets: z
      .array(z.object({
        file: z.string().describe('The path to the dataset file'),
      }))
      .describe('The paths to the dataset files'),
  })
  .strict();

export type ExperimentCfg = z.infer<typeof ExperimentCfgScheme>;
