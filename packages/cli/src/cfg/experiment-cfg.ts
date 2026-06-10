import * as z from 'zod';
import { Ajv } from 'ajv';
import { ToorError } from '@gettoor/core';

import { FatalError } from '../errors/index.js';
import { readFile } from '../io/index.js';
import { humanizeAjvErrors } from '../ajv/index.js';
import { 
  ExperimentCfgScheme,
  ExperimentCfg,
} from './experiment-cfg-types.js';

export function readExperimentCfg(filePath: string): ExperimentCfg {
  const content = readFile(filePath);
  try {
    const cfg = ExperimentCfgScheme.parse(content);
    if (cfg['structured-output']) {
      validateStructuredOutputScheme(cfg['structured-output'].schema);
    }
    return cfg;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new FatalError(
        `Invalid experiment configuration file ` + `
        ${ToorError.quote(filePath)}\n${z.prettifyError(error)}`
      );
    }
    throw error;
  }
}

function validateStructuredOutputScheme(schema: any): void {
  const ajv = new Ajv({ strict: true, messages: true, allErrors: true });
  const isValidSchema = ajv.validateSchema(schema);
  if (!isValidSchema) {
    const errorMessage = humanizeAjvErrors(ajv.errors ?? [], '- ').join('\n');
    throw new FatalError(`Invalid structured output schema:\n${errorMessage}`);
  }
}
