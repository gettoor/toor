import { generateText, Output } from 'ai';

import { InternalToorError, ToorError } from '../../errors/index.js';
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
  RPEDatasetValidatorContradiction,
  RPEDatasetValidatorDuplicate,
} from './rpe-dataset-validator-types.js';
import {
  CONTRADICTIONS_PROMPT,
} from './validator-contradictions-prompt.js';
import {
  ContradictionsOutput,
  ContradictionsOutputSchema,
} from './validator-contradictions-types.js';

export async function findContradictions(
  entries: RPEDatasetEntryWithName[],
  allDuplicates: RPEDatasetValidatorDuplicate[],
  additionalContext: string,
  model: LLMModel,
  modelParameters: ModelParameters | undefined,
): Promise<RPEDatasetValidatorContradiction[]> {
  const findDatasetEntry = (id: string): RPEDatasetEntryWithName => {
    const entry = entries.find(entry => entry.datasetEntryId === id);
    if (!entry) {
      throw new InternalToorError(
        `Dataset entry with identifier ` +
        `${ToorError.quote(id)} not found`,
      );
    }
    return entry;
  };

  // tasks
  const tasks = allDuplicates.map(duplicate => {
    return findContradiction(
      findDatasetEntry(duplicate.datasetEntryIdA),
      findDatasetEntry(duplicate.datasetEntryIdB),
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
      const duplicate = allDuplicates[index];
      return {
        datasetEntryIdA: duplicate.datasetEntryIdA,
        datasetEntryIdB: duplicate.datasetEntryIdB,
        ...output,
      };
    }).
    // take only contradictions
    filter(output => output.isContradiction)
    .map(output => {
      return {
        datasetEntryIdA: output.datasetEntryIdA,
        datasetEntryIdB: output.datasetEntryIdB,
        reasoning: output.reasoning,
        confidence: output.confidence,
      };
    });

  return result;
}

async function findContradiction(
  entryA: RPEDatasetEntryWithName,
  entryB: RPEDatasetEntryWithName,
  additionalContext: string,
  model: LLMModel,
  modelParameters: ModelParameters | undefined,  
): Promise<ContradictionsOutput> {
  const prompt = replacePlaceholders(
    CONTRADICTIONS_PROMPT,
    {
      additionalContext,
      variablesA: varsToPrompt(entryA.vars),
      expectedResponseA: expectedResponseToPrompt(entryA.expectedResponse),
      variablesB: varsToPrompt(entryB.vars),
      expectedResponseB: expectedResponseToPrompt(entryB.expectedResponse),
    },
  );

  const { output } = await generateText({
    model: model.model,
    prompt: prompt.text,
    ...buildModelCallSettings(modelParameters),
    output: Output.object({
      schema: ContradictionsOutputSchema,
    }),
  });  

  return output;
}