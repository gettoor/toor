import {
  RPEDatasetValidatorAmbiguity,
  RPEDatasetValidatorConflictingExactDuplicate,
  RPEDatasetValidatorContradiction,
  RPEDatasetValidatorDuplicate,
  RPEDatasetValidatorExpectedResponseDistribution,
  RPEDatasetValidatorInsufficientInformation,
  RPEDatasetValidatorLikelyIncorrectExpectedResponse,
  RPEDatasetValidatorOutput,
  RPEDatasetValidatorSplitLeak,
} from '@gettoor/core';

import {
  gray,
  yellow,
  bold,
  terminalWidth,
  separator,
  TableCell,
  printTable,
  newSection,
} from '../../console/index.js';

const DEFAULT_WIDTH = 64;
const width = Math.min(DEFAULT_WIDTH, terminalWidth());

export function printResults(results: RPEDatasetValidatorOutput): void {
  const { issues } = results;
  printExactDuplicates(issues.exactDuplicates);
  printExactSplitLeaks(issues.exactSplitLeaks);
  printNearDuplicates(issues.nearDuplicates);
  printNearSplitLeaks(issues.nearSplitLeaks);
  printConflictingExactDuplicates(issues.conflictingExactDuplicates);
  printLikelyIncorrectExpectedResponses(
    issues.likelyIncorrectExpectedResponses,
  );
  printContradictions(issues.contradictions);
  printAmbiguities(issues.ambiguities);
  printInsufficientInformation(issues.insufficientInformation);
  printExpectedResponseDistributions(issues.expectedResponseDistributions);
}

function printHeader(title: string, details?: string): void {
  process.stdout.write(yellow(bold(title)) + '\n');
  if (details) {
    process.stdout.write(gray(details) + '\n');
  }
  process.stdout.write('\n');
}

function printGap(): void {
  process.stdout.write('\n');
}

function printExactDuplicates(
  duplicates: RPEDatasetValidatorDuplicate[],
): void {
  if (duplicates.length === 0) {
    return;
  }

  console.log();
  printHeader(
    'Exact duplicates',
    'Pairs of dataset entries that have the exact same variables.',
  );
  const table: TableCell[][] = [[
    { value: 'Entry A' },
    { value: 'Entry B' },
  ]];
  for (const duplicate of duplicates) {
    table.push([
      { value: duplicate.datasetEntryIdA },
      { value: duplicate.datasetEntryIdB },
    ]);
  }
  printTable(table);
  printGap();
}

function printExactSplitLeaks(
  leaks: RPEDatasetValidatorSplitLeak[],
): void {
  if (leaks.length === 0) {
    return;
  }

  console.log();
  printHeader(
    'Exact split leaks',
    'Pairs of dataset entries that have the exact same variables ' +
    '\nbut belong to different datasets.',
  );
  const table: TableCell[][] = [[
    { value: 'Entry A' },
    { value: 'Dataset A' },
    { value: 'Entry B' },
    { value: 'Dataset B' },
  ]];
  for (const splitLeak of leaks) {
    table.push([
      { value: splitLeak.datasetEntryIdA },
      { value: splitLeak.datasetNameA },
      { value: splitLeak.datasetEntryIdB },
      { value: splitLeak.datasetNameB },
    ]);
  }
  printTable(table);
  printGap();
}

function printNearDuplicates(
  duplicates: RPEDatasetValidatorDuplicate[],
): void {
  if (duplicates.length === 0) {
    return;
  }

  console.log();
  printHeader(
    'Near duplicates',
    'Pairs of dataset entries that have similar variables.',
  );
  const table: TableCell[][] = [[
    { value: 'Entry A' },
    { value: 'Entry B' },
    { value: 'Similarity' },
  ]];
  for (const duplicate of duplicates) {
    table.push([
      { value: duplicate.datasetEntryIdA },
      { value: duplicate.datasetEntryIdB },
      { value: duplicate.similarity.toFixed(2) },
    ]);
  }
  printTable(table);
  printGap();
}

function printNearSplitLeaks(
  leaks: RPEDatasetValidatorSplitLeak[],
): void {
  if (leaks.length === 0) {
    return;
  }

  console.log();
  printHeader(
    'Near split leaks',
    'Pairs of dataset entries that have similar variables ' +
    '\nbut belong to different datasets.',
  );
  const table: TableCell[][] = [[
    { value: 'Entry A' },
    { value: 'Dataset A' },
    { value: 'Entry B' },
    { value: 'Dataset B' },
    { value: 'Similarity' },
  ]];
  for (const splitLeak of leaks) {
    table.push([
      { value: splitLeak.datasetEntryIdA },
      { value: splitLeak.datasetNameA },
      { value: splitLeak.datasetEntryIdB },
      { value: splitLeak.datasetNameB },
      { value: splitLeak.similarity.toFixed(2) },
    ]);
  }
  printTable(table);
  printGap();
}

function printConflictingExactDuplicates(
  duplicates: RPEDatasetValidatorConflictingExactDuplicate[],
): void {
  if (duplicates.length === 0) {
    return;
  }

  console.log();
  printHeader(
    'Conflicting exact duplicates',
    'Pairs of dataset entries that have the exact same variables ' +
    '\nbut have different expected responses.',
  );
  const table: TableCell[][] = [[
    { value: 'Entry A' },
    { value: 'Entry B' },
  ]];
  for (const duplicate of duplicates) {
    table.push([
      { value: duplicate.datasetEntryIdA },
      { value: duplicate.datasetEntryIdB },
    ]);
  }
  printTable(table);
  printGap();
}

function printLikelyIncorrectExpectedResponses(
  responses: RPEDatasetValidatorLikelyIncorrectExpectedResponse[],
): void {
  if (responses.length === 0) {
    return;
  }

  console.log();
  printHeader(
    'Likely incorrect expected responses',
    'Dataset entries that have a likely incorrect expected response.',
  );

  for (let index = 0; index < responses.length; index++) {
    if (index > 0) {
      process.stdout.write('\n');
    }
    const response = responses[index];
    const section = newSection();
    section.property('Entry', response.datasetEntryId);
    section.property('Confidence', response.confidence.toFixed(2));
    section.property('Reasoning', response.reasoning);
  }
  printGap();
}

function printContradictions(
  contradictions: RPEDatasetValidatorContradiction[],
): void {
  if (contradictions.length === 0) {
    return;
  }

  console.log();
  printHeader(
    'Contradictions',
    'Pairs of dataset entries that have the exact same or\nsimilar variables ' +
    'but have different expected responses.',
  );

  for (let index = 0; index < contradictions.length; index++) {
    if (index > 0) {
      process.stdout.write('\n');
    }
    const contradiction = contradictions[index];
    const section = newSection();
    section.property('Entry A', contradiction.datasetEntryIdA);
    section.property('Entry B', contradiction.datasetEntryIdB);
    section.property('Confidence', contradiction.confidence.toFixed(2));
    section.property('Reasoning', contradiction.reasoning);
  }
  printGap();
}

function printAmbiguities(
  ambiguities: RPEDatasetValidatorAmbiguity[],
): void {
  if (ambiguities.length === 0) {
    return;
  }

  console.log();
  printHeader(
    'Ambiguities',
    'Dataset entries that have an ambiguous expected response.',
  );

  for (let index = 0; index < ambiguities.length; index++) {
    if (index > 0) {
      process.stdout.write('\n');
    }
    const ambiguity = ambiguities[index];
    const section = newSection();
    section.property('Entry', ambiguity.datasetEntryId);
    section.property('Confidence', ambiguity.confidence.toFixed(2));
    if (ambiguity.ambiguousFields && ambiguity.ambiguousFields.length > 0) {
      section.property(
        'Ambiguous fields',
        ambiguity.ambiguousFields.join(', '),
      );
    }
    section.property('Reasoning', ambiguity.reasoning);
  }
  printGap();
}

function printInsufficientInformation(
  information: RPEDatasetValidatorInsufficientInformation[],
): void {
  if (information.length === 0) {
    return;
  }

  console.log();
  printHeader(
    'Insufficient information',
    'Dataset entries that have insufficient information.',
  );

  for (let index = 0; index < information.length; index++) {
    if (index > 0) {
      process.stdout.write('\n');
    }
    const info = information[index];
    const section = newSection();
    section.property('Entry', info.datasetEntryId);
    section.property('Confidence', info.confidence.toFixed(2));
    if (info.insufficientFields && info.insufficientFields.length > 0) {
      section.property(
        'Insufficient fields',
        info.insufficientFields.join(', '),
      );
    }
    section.property('Reasoning', info.reasoning);
  }
  printGap();
}

function printExpectedResponseDistributions(
  distributions: RPEDatasetValidatorExpectedResponseDistribution[],
): void {
  if (distributions.length === 0) {
    return;
  }

  console.log();
  printHeader(
    'Expected response distributions',
    'Datasets with imbalanced expected response distributions.',
  );
  const table: TableCell[][] = [[
    { value: 'Dataset' },
    { value: 'Field' },
    { value: 'Imbalance' },
  ]];

  for (let index = 0; index < distributions.length; index++) {
    const distribution = distributions[index];
    for (const field of distribution.fieldDistributions) {
      const section = newSection();
      table.push([
        { value: distribution.datasetName },
        { value: field.fieldName.length > 0 ? field.fieldName : '-' },
        { value: field.distributionImbalance.toFixed(2) },
      ]);
    }
  }
  printTable(table);
  printGap();
}