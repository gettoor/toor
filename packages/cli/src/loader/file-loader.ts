import fs from 'fs';
import { extname, join, resolve } from 'path';
import yaml from 'yaml';
import * as z from 'zod';
import { ToorError } from '@gettoor/core';

import { FatalError } from '../errors/index.js';

export function loadFile<T>(
  filePath: string,
  cfgDir: string,
  scheme?: z.ZodSchema,
): T {
  const fullFilePath = resolve(
    join(cfgDir, filePath)
  );
  const contentStr = fs.readFileSync(fullFilePath, 'utf8');
  let content: any;

  const extension = extname(filePath);
  if (extension === '.json') {
    content = JSON.parse(contentStr);
  }

  if (extension === '.yaml' || extension === '.yml') {
    content = yaml.parse(contentStr);
  }

  if (content === undefined) {
    throw new FatalError(
      `Unsupported extension of ${ToorError.quote(filePath)}`,
    );
  }

  if (scheme) {
    try {
      content = scheme.parse(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new FatalError(
          `Invalid file ${ToorError.quote(filePath)}\n` +
          `${z.prettifyError(error)}`
        );
      }
      throw error;
    }
  }

  return content as T;
}