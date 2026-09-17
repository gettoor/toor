import { RPEDatasetEntry } from '@gettoor/core';

let entryIdSeq = 0;

export function entry(
  input: string,
  sentiment: 'positive' | 'neutral' | 'negative',
  reasoning?: string,
): RPEDatasetEntry {
  return {
    datasetEntryId: `e${entryIdSeq++}`,
    vars: {
      input,
    },
    expectedResponse: sentiment,
    expectedResponseReasoning: reasoning,
  };
}