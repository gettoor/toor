import fs from 'node:fs';
import { z } from 'zod';
import * as YAML from 'yaml';

import { RPEIOFormat } from './rpe-io-core-types.js';
import { UnknownRPEIOFormatError } from './rpe-io-core-errors.js';

export function readFromString<T>(
  str: string,
  format: RPEIOFormat,
  schema: z.ZodType<T>,
): T {
  let data: object;
  if (format === 'json') {
    data = JSON.parse(str);
  }
  else if (format === 'yaml') {
    data = YAML.parse(str);
  }
  else {
    throw new UnknownRPEIOFormatError(format);
  }
  return schema.parse(data);
}

export function readFromFile<T>(
  path: string,
  format: RPEIOFormat,
  schema: z.ZodType<T>,
): T {
  const data = fs.readFileSync(path, 'utf8');
  return readFromString(data, format, schema);
}

export function writeToString<T>(
  data: T,
  format: RPEIOFormat,
): string {
  if (format === 'yaml') {
    return YAML.stringify(data);
  }
  else if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  throw new UnknownRPEIOFormatError(format);
}