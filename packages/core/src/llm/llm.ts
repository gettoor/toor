import { z } from 'zod';
import { generateText, Output, asSchema, type FlexibleSchema, type InferSchema } from 'ai';

import { 
  LLMGenerateTextInput,
  LLMGenerateTextInputOutput,
  LLMGenerateStructuredOutputInput,
  LLMGenerateStructuredOutputOutput,
} from './llm-types.js';
import { InvalidLLMStructuredOutputError } from './llm-errors.js';
import { buildModelCallSettings } from './llm-utils.js';

/**
 * Generates text input from a language model.
 * @category LLM
 * @param input - Input for generating text input.
 * @returns Output for generating text input.
 */
export async function llmGenerateText(
  input: LLMGenerateTextInput,
): Promise<LLMGenerateTextInputOutput> {
  const { model } = input;

  // generate
  const response = await generateText({
    model: model.model,
    prompt: input.prompt,
    ...buildModelCallSettings(input.modelParameters),
  });

  return {
    output: response.text,
    usage: {
      modelUsage: [
        {
          modelName: model.name,
          inputTokens: response.usage.inputTokens,
          outputTokens: response.usage.outputTokens,
        },
      ],
    },
  };
}

function isZodSchema(schema: FlexibleSchema): schema is z.ZodType {
  return typeof schema === 'object'
    && schema !== null
    && '_zod' in schema
    && 'safeParse' in schema
    && typeof schema.safeParse === 'function';
}

/**
 * Validates model output against a Zod schema or an AI SDK schema
 * (`jsonSchema`, standard schema, and the other `FlexibleSchema` forms).
 */
async function parseStructuredOutput<T extends FlexibleSchema>(
  schema: T,
  value: unknown,
): Promise<InferSchema<T>> {
  if (isZodSchema(schema)) {
    const result = schema.safeParse(value);
    if (!result.success) {
      throw new InvalidLLMStructuredOutputError(z.prettifyError(result.error));
    }
    return result.data as InferSchema<T>;
  }

  const normalized = asSchema(schema);
  if (normalized.validate == null) {
    return value as InferSchema<T>;
  }

  const result = await normalized.validate(value);
  if (!result.success) {
    throw new InvalidLLMStructuredOutputError(result.error.message);
  }
  return result.value as InferSchema<T>;
}

/**
 * Generates structured output from a language model.
 * @category LLM
 * @param input - Input for generating structured output.
 * @returns Output for generating structured output.
 */
export async function llmGenerateStructuredOutput<
  T extends FlexibleSchema,
>(
  input: LLMGenerateStructuredOutputInput<T>,
): Promise<LLMGenerateStructuredOutputOutput<T>> {
  const { model } = input;

  // generate
  const response = await generateText({
    model: model.model,
    prompt: input.prompt,
    ...buildModelCallSettings(input.modelParameters),
    output: Output.object({ schema: input.schema }),
    providerOptions: model.structuredOutputProviderOptions,
  });

  // validate
  const output = await parseStructuredOutput(input.schema, response.output);

  return {
    output,
    usage: {
      modelUsage: [
        {
          modelName: model.name,
          inputTokens: response.usage.inputTokens,
          outputTokens: response.usage.outputTokens,
        },
      ],
    },
  };
}
