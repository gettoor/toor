import * as z from 'zod';

// see ModelParameters in @gettoor/core
export const ModelParametersScheme = z.object({
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
});