import { generateText } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { runParallelBatchesOrThrow } from '../../concurrency/index.js';
import {
  buildModelCallSettings,
  LLMModel,
  ModelParameters,
} from '../../llm/index.js';
import { DefaultModelProvider } from '../../model-provider/index.js';
import { modelParametersToRPEInfo } from '../rpe-info/index.js';
import { RPEDatasetEntry } from '../rpe-dataset/index.js';
import {
  candidateRefFromCandidate,
  requireSinglePromptCandidateModule,
  RPECandidate,
} from '../rpe-candidate/index.js';
import { 
  RPEExecutor,
  RPEExecutorInfo,
  RPEExecutorInput,
  RPEExecutorResponse,
} from './rpe-executor-types.js';
import {
  SinglePromptLLMRPEExecutorInput,
} from './single-prompt-llm-rpe-executor-types.js';
import {
  DEFAULT_SINGLE_PROMPT_LLM_RPE_EXECUTOR_PARALLELISM,
} from './single-prompt-llm-rpe-executor-consts.js';

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
  const { modelName, modelParameters, parallelism, dataset} = input;
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();

  return {
    run: async (input: RPEExecutorInput) => {
      const model = await modelProvider.getModel(modelName);

      // tasks
      const tasks: Promise<RPEExecutorResponse>[] = [];
      for (const candidate of input.candidates) {
        for (const datasetEntry of dataset.entries) {
          tasks.push(generateResponse(model, modelParameters, candidate, datasetEntry));
        }
      }

      // run tasks in parallel
      const responses = await runParallelBatchesOrThrow(
        tasks,
        parallelism ?? DEFAULT_SINGLE_PROMPT_LLM_RPE_EXECUTOR_PARALLELISM,
      );
      return { responses };
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

async function generateResponse(
  model: LLMModel,
  modelParameters: ModelParameters | undefined,
  candidate: RPECandidate,
  datasetEntry: RPEDatasetEntry,
): Promise<RPEExecutorResponse> {
  // build prompt
  const prompt = replacePlaceholders(
    requireSinglePromptCandidateModule(candidate.modules),
    datasetEntry.vars ?? {},
  );

  // generate text response
  const response = await generateText({
    model: model.model,
    prompt: prompt.text,
    ...buildModelCallSettings(modelParameters),
  });

  return {
    candidateRef: candidateRefFromCandidate(candidate),
    datasetEntry: datasetEntry,
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
}