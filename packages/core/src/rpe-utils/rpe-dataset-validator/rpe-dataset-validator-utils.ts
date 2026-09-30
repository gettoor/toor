import { cosineSimilarity } from 'ai';

import { InternalToorError, ToorError } from '../../errors/index.js';
import { RPEDatasetEntry, RPEResponse } from '../../rpe-core/index.js';
import { RPEDatasetEntryWithName } from './rpe-dataset-validator-types.js';

export function calculateSimilarity(
  embeddingA: number[],
  embeddingB: number[],
): number {
  // cosine similarity returns a value between -1 and 1
  // where 1 is the most similar
  const similarity = cosineSimilarity(embeddingA, embeddingB);
  return (similarity + 1) / 2; // normalize to 0..1
}

export function isDuplicate(
  entryA: RPEDatasetEntry,
  entryB: RPEDatasetEntry,
): boolean {
  const keysA = Object.keys(entryA.vars);
  const keysB = Object.keys(entryB.vars);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const keyA of keysA) {
    const valueA = entryA.vars[keyA];
    const valueB = entryB.vars[keyA];
    if (valueA.toLowerCase() !== valueB.toLowerCase()) {
      return false;
    }
  }
  return true;
}

export function findDatasetNameByDatasetEntryId(
  allEntries: RPEDatasetEntryWithName[],
  datasetEntryId: string,
): string {
  const entry = allEntries.find(entry => {
    return entry.datasetEntryId === datasetEntryId;
  });
  if (!entry) {
    throw new InternalToorError(
      `Dataset entry with identifier ` +
      `${ToorError.quote(datasetEntryId)} not found`,
    );
  }
  return entry.datasetName;
}

export function varsToPrompt(vars: Record<string, any>): string {
  const varNames = Object.keys(vars).sort();
  return varNames
    .map(name => {
      const value = vars[name];
      if (typeof value === 'object') {
        return `${name}: ${JSON.stringify(value)}`;
      }
      return `${name}: ${value}`;
    })
    .join('\n\n');

}

export function expectedResponseToPrompt(
  expectedResponse: RPEResponse | undefined,
): string {
  if (!expectedResponse) {
    throw new InternalToorError(
      'Expected response is required',
    );
  }
  if (typeof expectedResponse === 'string') {
    return expectedResponse;
  }
  return JSON.stringify(expectedResponse);
}