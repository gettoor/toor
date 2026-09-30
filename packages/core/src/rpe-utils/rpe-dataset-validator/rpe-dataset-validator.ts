import { embedMany } from 'ai';

import { DefaultModelProvider } from '../../model-provider/index.js';
import { RPEDatasetEntry } from '../../rpe-core/index.js';
import {
  RPEDatasetEntryWithName,
  RPEDatasetValidatorInput,
  RPEDatasetValidatorIssues,
  RPEDatasetValidatorOutput,
} from './rpe-dataset-validator-types.js';
import {
  NonUniqueDatasetEntriesError,
} from './rpe-dataset-validator-errors.js';
import {
  findExactDuplicates,
} from './validator-exact-duplicates.js';
import {
  findNearDuplicates,
} from './validator-near-duplicates.js';
import {
  findExactSplitLeaks,
} from './validator-exact-split-leakage.js';
import {
  findNearSplitLeaks,
} from './validator-near-split-leakage.js';
import {
  findConflictingExactDuplicates,
} from './validator-conflicting-exact-duplicates.js';
import {
  findLikelyIncorrectExpectedResponses,
} from './validator-likely-incorrect-expected-response.js';
import { findContradictions } from './validator-contradictions.js';
import { findAmbiguities } from './validator-ambiguity.js';
import {
  findInsufficientInformation,
} from './validator-insufficient-information.js';

/*
|    Group        |            Check            |        Primary method        |    LLM?     | Embeddings? |    Stage    |
|-----------------|-----------------------------|------------------------------|-------------|-------------|-------------|
| **Structural**  | Missing/invalid data        | Code                         | No          | No          |
|                 | Invalid expected output     | Code/schema                  | No          | No          |
|                 | Exact duplicate             | Code/hash                    | No          | No          | one [done]
|                 | Conflicting exact duplicate | Code                         | No          | No          | one [done]
|                 | Exact split leakage         | Code/hash                    | No          | No          | one [done]
| **Semantic**    | Near duplicate              | Embeddings                   | Optional    | **Yes**     | one [done]
|                 | Semantic split leakage      | Embeddings                   | Optional    | **Yes**     | one [done]
|                 | Contradiction               | Embeddings → LLM             | **Yes**     | **Yes**     | one [done]
|                 | Likely incorrect expected   | LLM                          | **Yes**     | No          | one [done]
|                 | Ambiguous                   | LLM                          | **Yes**     | No          | one [done]
|                 | Insufficient information    | LLM                          | **Yes**     | No          | one
|                 | Inconsistent policy         | Embeddings/grouping → LLM    | **Yes**     | **Yes**     | one
| **Statistical** | Class imbalance             | Code                         | No          | No          |
|                 | Coverage gap                | LLM + code                   | **Yes**     | Optional    | one
|                 | Overrepresented concept     | Embeddings/clustering + code | Optional    | **Yes**     |
|                 | Outlier                     | Code + embeddings            | No/Optional | **Yes**     |
*/

export async function validateRPEDataset(
  input: RPEDatasetValidatorInput,
): Promise<RPEDatasetValidatorOutput> {
  const {
    datasets,
    additionalContext,
    modelName,
    modelParameters,
    embeddingsModelName,
    modelProvider = new DefaultModelProvider(),
    nearDuplicateThreshold = 0.9,
  } = input;

  // models
  const model = await modelProvider.getModel(modelName);
  const embeddingsModel = await modelProvider.getEmbeddingModel(
    embeddingsModelName,
  );

  const allEntries: RPEDatasetEntryWithName[] = Object.entries(datasets)
    .flatMap(([datasetName, dataset]) => {
      return dataset.entries.map(entry => ({
        ...entry,
        datasetName,
      }));
    });
  
  // dataset entries must be unique
  checkDatasetEntryUniqueness(allEntries);

  // embed the dataset entries
  const { embeddings: embeddingsArray } = await embedMany({
    model: embeddingsModel.model,
    values: allEntries.map(datasetEntryToString),
  });
  const embeddings: Record<string, number[]> = {};
  for (const [index, embedding] of embeddingsArray.entries()) {
    embeddings[allEntries[index].datasetEntryId] = embedding;
  }

  // find issues
  const exactDuplicates = findExactDuplicates(allEntries);
  const exactSplitLeaks = findExactSplitLeaks(allEntries);
  const nearDuplicates = findNearDuplicates(
    embeddings,
    nearDuplicateThreshold,
    exactDuplicates,
  );
  const [
    likelyIncorrectExpectedResponses,
    contradictions,
    ambiguities,
    insufficientInformation,
  ] = await Promise.all([
    findLikelyIncorrectExpectedResponses(
      allEntries,
      additionalContext,
      model,
      modelParameters,
    ),
    findContradictions(
      allEntries,
      [...exactDuplicates, ...nearDuplicates],
      additionalContext,
      model,
      modelParameters,
    ),
    findAmbiguities(
      allEntries,
      additionalContext,
      model,
      modelParameters,
    ),
    findInsufficientInformation(
      allEntries,
      additionalContext,
      model,
      modelParameters,
    ),
  ]);

  const issues: RPEDatasetValidatorIssues = {
    exactDuplicates,
    exactSplitLeaks,
    nearDuplicates,
    nearSplitLeaks: findNearSplitLeaks(
      allEntries,
      embeddings,
      nearDuplicateThreshold,
      exactSplitLeaks,
    ),
    conflictingExactDuplicates: findConflictingExactDuplicates(
      allEntries,
      exactDuplicates,
    ),
    likelyIncorrectExpectedResponses,
    contradictions,
    ambiguities,
    insufficientInformation,
  };
  return { issues };
}

function datasetEntryToString(entry: RPEDatasetEntry): string {
  const vars = Object.keys(entry.vars);
  return vars.map(varName => `${entry.vars[varName]}`).join(', ');
}

function checkDatasetEntryUniqueness(
  allEntries: RPEDatasetEntryWithName[],
): void {
  const counts: Record<string, number> = {};
  for (const entry of allEntries) {
    counts[entry.datasetEntryId] = (counts[entry.datasetEntryId] ?? 0) + 1;
  }
  const nonUniqueIds = Object.entries(counts)
    .filter(([_, count]) => count > 1)
    .map(([id]) => id);
  if (nonUniqueIds.length > 0) {
    throw new NonUniqueDatasetEntriesError(nonUniqueIds);
  }
}

