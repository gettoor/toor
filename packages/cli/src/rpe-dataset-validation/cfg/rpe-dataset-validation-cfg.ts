import * as z from 'zod';
import { ToorError } from '@gettoor/core';

import { FatalError } from '../../errors/index.js';
import { readFile } from '../../io/index.js';
import {
  RPEDatasetValidationCfg,
  RPEDatasetValidationCfgScheme,
} from './rpe-dataset-validation-cfg-types.js';

export function readRPEDatasetValidationCfg(
  filePath: string,
): RPEDatasetValidationCfg {
  const content = readFile(filePath);
  try {
    return RPEDatasetValidationCfgScheme.parse(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new FatalError(
        `Invalid RPE dataset validation configuration file ` + `
        ${ToorError.quote(filePath)}\n${z.prettifyError(error)}`
      );
    }
    throw error;
  }
}