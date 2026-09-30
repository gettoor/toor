import { generateText, Output } from 'ai';

import { runParallelBatchesOrThrow } from '../../concurrency/parallel.js';
import { LLMModel, ModelParameters } from '../../llm/llm-types.js';
import { buildModelCallSettings } from '../../llm/llm-utils.js';
import { replacePlaceholders } from '../../string/placeholders.js';
import {
  RPEDatasetEntryWithName,
  RPEDatasetValidatorInsufficientInformation,
} from './rpe-dataset-validator-types.js';
import {
  expectedResponseToPrompt,
  varsToPrompt,
} from './rpe-dataset-validator-utils.js';
import {
  InsufficientInformationOutput,
  InsufficientInformationOutputSchema,
} from './validator-insufficient-information-types.js';
import {
  INSUFFICIENT_INFORMATION_PROMPT,
} from './validator-insufficient-information-prompt.js';

export async function findInsufficientInformation(
  entries: RPEDatasetEntryWithName[],
  additionalContext: string,
  model: LLMModel,
  modelParameters: ModelParameters | undefined,
): Promise<RPEDatasetValidatorInsufficientInformation[]> {
  // tasks
  const tasks = entries.map(entry => {
    return findInsufficientInformationForEntry(
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
      return {
        datasetEntryId: entry.datasetEntryId,
        ...output,
      };
    }).
    // take only insufficient information
    filter(output => !output.hasSufficientInformation)
    .map(output => {
      return {
        datasetEntryId: output.datasetEntryId,
        reasoning: output.reasoning,
        confidence: output.confidence,
        insufficientFields: output.insufficientFields,
      };
    });

  return result;
}

async function findInsufficientInformationForEntry(
  entry: RPEDatasetEntryWithName,
  additionalContext: string,
  model: LLMModel,
  modelParameters: ModelParameters | undefined,
): Promise<InsufficientInformationOutput> {
  const prompt = replacePlaceholders(
    INSUFFICIENT_INFORMATION_PROMPT,
    {
      additionalContext,
      variables: varsToPrompt(entry.vars),
    },
  );
  const { output } = await generateText({
    model: model.model,
    prompt: prompt.text,
    ...buildModelCallSettings(modelParameters),
    output: Output.object({
      schema: InsufficientInformationOutputSchema,
    }),
  });
  return output;
}