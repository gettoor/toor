import { generateText } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { buildModelCallSettings } from '../../llm/index.js';
import { DefaultModelProvider } from '../../model-provider/index.js';
import { promptRefFromPrompt } from '../rpe-prompt/index.js';
import { RPEExecutor, RPEExecutorInput } from './rpe-executor-types.js';
import { LLMRPEExecutorInput } from './llm-rpe-executor-types.js';

/**
 * Creates an RPE executor that uses a LLM to generate a response.
 * @category Reflective Prompt Evolution
 * @param input - Input for the RPE executor creation.
 * @returns An RPE executor that uses a LLM to generate a response.
 */
export function llmRPEExecutor(
  input: LLMRPEExecutorInput,
): RPEExecutor {
  const { modelName, modelParameters } = input;
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();

  return async (input: RPEExecutorInput) => {
    const model = await modelProvider.getModel(modelName);
  
    // build prompt
    const prompt = replacePlaceholders(
      input.prompt.prompt,
      input.datasetEntry.vars ?? {},
    );

    // generate text response
    const response = await generateText({
      model,
      prompt: prompt.text,
      ...buildModelCallSettings(modelParameters),
    });

    return {
      promptRef: promptRefFromPrompt(input.prompt),
      datasetEntry: input.datasetEntry,
      response: response.text,
      usage: {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
      },
    };
  };
}