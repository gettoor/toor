import { extname } from 'path';
import fs from 'fs';
import yaml from 'yaml';

import { FatalError } from '../errors/index.js';

/**
 * Reads a file and returns the content.
 * @param filePath - The path to the file to read.
 * @returns The content of the file.
 */
export function readFile(filePath: string): object {
  const extension = extname(filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  const validate = (content: any): object => {
    if (typeof content !== 'object') {
      throw new FatalError(`Content of ${filePath} is not an object`);
    }
    if (Array.isArray(content)) {
      throw new FatalError(`Content of ${filePath} is an array`);
    }
    return content;
  }

  if (extension === '.json') {
    return validate(JSON.parse(content));
  }

  if (extension === '.yaml' || extension === '.yml') {
    return validate(yaml.parse(content));
  }

  throw new FatalError(`Unsupported extension of ${filePath}`);
}