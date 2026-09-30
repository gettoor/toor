import { generateText, Output } from 'ai';

import {
  buildModelCallSettings,
  LLMModel,
  ModelParameters,
} from '../../llm/index.js';
import { replacePlaceholders } from '../../string/index.js';
import { runParallelBatchesOrThrow } from '../../concurrency/index.js';
import {
  expectedResponseToPrompt,
  varsToPrompt,
} from './rpe-dataset-validator-utils.js';
import {
  RPEDatasetEntryWithName,
  RPEDatasetValidatorLikelyIncorrectExpectedResponse,
} from './rpe-dataset-validator-types.js';
import {
  LIKELY_INCORRECT_EXPECTED_RESPONSE_PROMPT,
} from './validator-likely-incorrect-expected-response-prompt.js';
import {
  LikelyIncorrectExpectedResponseOutput,
  LikelyIncorrectExpectedResponseOutputSchema,
} from './validator-likely-incorrect-expected-response-types.js';

export async function findLikelyIncorrectExpectedResponses(
  entries: RPEDatasetEntryWithName[],
  additionalContext: string,
  model: LLMModel,
  modelParameters: ModelParameters | undefined,
): Promise<RPEDatasetValidatorLikelyIncorrectExpectedResponse[]> {
  // tasks
  const tasks = entries.map(entry => {
    return findLikelyIncorrectExpectedResponse(
      entry,
      additionalContext,
      model,
      modelParameters,
    );
  });

  // run tasks in parallel
  const parallelism = 8;
  const outputs = await runParallelBatchesOrThrow(
    tasks,
    parallelism,
  );

  // filter & map
  const result = outputs
    .map((output, index) => {
      const entry = entries[index];
      return { ...output, datasetEntryId: entry.datasetEntryId };
    })
    // take only likely incorrect expected responses
    .filter(output => !output.isExpectedResponseCorrect)
    .map(output => {
      return {
        datasetEntryId: output.datasetEntryId,
        reasoning: output.reasoning,
        confidence: output.confidence,
      };
    });

  return result;
}

async function findLikelyIncorrectExpectedResponse(
  entry: RPEDatasetEntryWithName,
  additionalContext: string,
  model: LLMModel,
  modelParameters: ModelParameters | undefined,
): Promise<LikelyIncorrectExpectedResponseOutput> {
  const prompt = replacePlaceholders(
    LIKELY_INCORRECT_EXPECTED_RESPONSE_PROMPT,
    {
      variables: varsToPrompt(entry.vars),
      additionalContext,
      expectedResponse: expectedResponseToPrompt(entry.expectedResponse),
    },
  );

  const { output } = await generateText({
    model: model.model,
    prompt: prompt.text,
    ...buildModelCallSettings(modelParameters),
    output: Output.object({
      schema: LikelyIncorrectExpectedResponseOutputSchema,
    }),
  });

  return output;
}