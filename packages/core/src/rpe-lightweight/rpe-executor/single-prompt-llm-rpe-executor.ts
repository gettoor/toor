import { jsonSchema, JSONSchema7 } from 'ai';

import { replacePlaceholders } from '../../string/index.js';
import { runParallelBatchesOrThrow } from '../../concurrency/index.js';
import {
  llmGenerateStructuredOutput,
  llmGenerateText,
  LLMModel,
  ModelParameters,
} from '../../llm/index.js';
import { DefaultModelProvider } from '../../model-provider/index.js';
import {
  modelParametersToRPEInfo,
  RPEDatasetEntry,
  candidateRefFromCandidate,
  RPECandidate,
  RPEExecutor,
  RPEExecutorInfo,
  RPEExecutorInput,
  RPEExecutorResponse,
  RPEState,
  buildPromptFromSinglePromptCandidate,
  RPEResponse,
} from '../../rpe-core/index.js';
import {
  SinglePromptLLMRPEExecutorInput,
} from './single-prompt-llm-rpe-executor-types.js';
import {
  SINGLE_PROMPT_LLM_RPE_EXECUTOR_PARALLELISM,
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
  const {
    modelName,
    modelParameters,
    parallelism,
    dataset,
    structuredOutputSchema,
  } = input;
  const modelProvider = input.modelProvider ?? new DefaultModelProvider();

  return {
    run: async (state: RPEState, input: RPEExecutorInput) => {
      const model = await modelProvider.getModel(modelName);
      const effectiveDataset = typeof dataset === 'function'
        ? await dataset(state)
        : dataset;

      // tasks
      const tasks: Promise<RPEExecutorResponse>[] = [];
      for (const candidate of input.candidates) {
        for (const datasetEntry of effectiveDataset.entries) {
          tasks.push(
            generateResponse(
              model,
              modelParameters,
              candidate,
              datasetEntry,
              structuredOutputSchema,
            )
          );
        }
      }

      // run tasks in parallel
      const responses = await runParallelBatchesOrThrow(
        tasks,
        parallelism ?? SINGLE_PROMPT_LLM_RPE_EXECUTOR_PARALLELISM,
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
  structuredOutputSchema?: JSONSchema7,
): Promise<RPEExecutorResponse> {
  // build prompt
  const prompt = replacePlaceholders(
    buildPromptFromSinglePromptCandidate(candidate),
    datasetEntry.vars,
  );

  // generate structured output response
  if (structuredOutputSchema) {
    const { output, usage } = await llmGenerateStructuredOutput({
      model: model,
      prompt: prompt.text,
      modelParameters,
      schema: jsonSchema(structuredOutputSchema),
    });
    return {
      candidateRef: candidateRefFromCandidate(candidate),
      datasetEntry: datasetEntry,
      response: output as RPEResponse,
      usage,
      metadata: {
        prompt: prompt.text,
      },
    };
  }

  // generate text response
  const { output, usage } = await llmGenerateText({
    model: model,
    prompt: prompt.text,
    modelParameters,
  });

  return {
    candidateRef: candidateRefFromCandidate(candidate),
    datasetEntry: datasetEntry,
    response: output,
    usage,
    metadata: {
      prompt: prompt.text,
    },
  };  
}