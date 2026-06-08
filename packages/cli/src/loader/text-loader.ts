import fs from 'fs';
import { join, resolve } from 'path';

import { FatalError } from '../errors/index.js';

export function loadTextBySpec(spec: string, baseDir: string): string {
  // read from file
  const FILE_PREFIX = '$file:';
  if (spec.startsWith(FILE_PREFIX)) {
    const filePath = resolve(
      join(baseDir, spec.slice(FILE_PREFIX.length))
    );
    if (!fs.existsSync(filePath)) {
      throw new FatalError(`File "${filePath}" not found`);
    }
    return fs.readFileSync(filePath, 'utf8').toString();
  }

  // take the string as is
  return spec;
}