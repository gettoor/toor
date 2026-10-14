import fs from 'fs';
import { newSpinner } from '../../console/index.js';
import {
  RPEDatasetValidatorInput,
  RPEDatasetValidatorOutput,
  validateRPEDataset,
} from '@gettoor/core';
import { printResults } from './rpe-dataset-validation-results.js';

export async function runRPEDatasetValidation(
  input: RPEDatasetValidatorInput,
): Promise<void> {
  let output: RPEDatasetValidatorOutput | undefined;
  const spinner = newSpinner();
  spinner.start('Validating dataset(s)...');
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    output = await validateRPEDataset(input);
  } finally {
    spinner.stop();
  }
  printResults(output);
}
