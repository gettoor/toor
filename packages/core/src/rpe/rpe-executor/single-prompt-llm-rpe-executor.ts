import { generateText } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { buildModelCallSettings } from '../../llm/index.js';
import { DefaultModelProvider } from '../../model-provider/index.js';
import {
  candidateRefFromCandidate,
  requireSinglePromptCandidateModule,
} from '../rpe-candidate/index.js';
import { 
  RPEExecutor,
  RPEExecutorInfo,
  RPEExecutorInput,
} from './rpe-executor-types.js';
import {
  SinglePromptLLMRPEExecutorInput,
} from './single-prompt-llm-rpe-executor-types.js';
import { modelParametersToRPEInfo } from '../rpe-info/index.js';

/**
 * Creates a single-prompt RPE executor that uses a LLM to generate a response.
 * The executor expects a candidate with a single module `prompt`.
 * @category Reflective Prompt Evolution
 * @param input - Input for the RPE executor creation.
 * @returns An RPE executor that uses a LLM to generate a response.
 */
export function singlePromptLLMRPEExecutor(
  input: SinglePromptLLMRPEExecutorInput,
): RPEExecutor {
  const { modelName, modelParameters } = input;
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();

  return {
    run: async (input: RPEExecutorInput) => {
      const model = await modelProvider.getModel(modelName);
    
      // build prompt
      const prompt = replacePlaceholders(
        requireSinglePromptCandidateModule(input.candidate.modules),
        input.datasetEntry.vars ?? {},
      );

      // generate text response
      const response = await generateText({
        model: model.model,
        prompt: prompt.text,
        ...buildModelCallSettings(modelParameters),
      });

      return {
        candidateRef: candidateRefFromCandidate(input.candidate),
        datasetEntry: input.datasetEntry,
        response: response.text,
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
    },

    getInfo: async (): Promise<RPEExecutorInfo> => {
      return {
        name: 'Single-prompt LLM Executor',
        properties: [
          {
            key: 'model',
            value: modelProvider.getProviderModelName(modelName),
            description: 'Model name used for the execution.',
          },
          ...modelParametersToRPEInfo(modelParameters),
        ],
      };
    },
  };
}