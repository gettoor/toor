import { generateText, Output } from 'ai';

import { runParallelBatchesOrThrow } from '../../concurrency/index.js';
import {
  buildModelCallSettings,
  LLMModel,
  ModelParameters,
} from '../../llm/index.js';
import { replacePlaceholders } from '../../string/placeholders.js';
import {
  expectedResponseToPrompt,
  varsToPrompt,
} from './rpe-dataset-validator-utils.js';
import {
  RPEDatasetEntryWithName,
  RPEDatasetValidatorAmbiguity,
} from './rpe-dataset-validator-types.js';
import { AMBIGUITY_PROMPT } from './validator-ambiguity-prompt.js';
import {
  AmbiguityOutput,
  AmbiguityOutputSchema,
} from './validator-ambiguity-types.js';

export async function findAmbiguities(
  entries: RPEDatasetEntryWithName[],
  additionalContext: string,
  model: LLMModel,
  modelParameters: ModelParameters | undefined,
): Promise<RPEDatasetValidatorAmbiguity[]> {
  // tasks
  const tasks = entries.map(entry => {
    return findAmbiguity(
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
    // take only ambiguities
    .filter(output => output.isAmbiguous)
    .map(output => {
      return {
        datasetEntryId: output.datasetEntryId,
        reasoning: output.reasoning,
        confidence: output.confidence,
        alternativeResponses: output.alternativeResponses,
        ambiguousFields: output.ambiguousFields,
      };
    });

  return result;
}

async function findAmbiguity(
  entry: RPEDatasetEntryWithName,
  additionalContext: string,
  model: LLMModel,
  modelParameters: ModelParameters | undefined,
): Promise<AmbiguityOutput> {
  const prompt = replacePlaceholders(
    AMBIGUITY_PROMPT,
    {
      additionalContext,
      variables: varsToPrompt(entry.vars),
      expectedResponse: expectedResponseToPrompt(entry.expectedResponse),
    },
  );

  const { output } = await generateText({
    model: model.model,
    prompt: prompt.text,
    ...buildModelCallSettings(modelParameters),
    output: Output.object({
      schema: AmbiguityOutputSchema,
    }),
  });  

  return output;
}