import fs from 'fs/promises';
import path from 'path';

export async function readFile(dir: string, file: string): Promise<string> {
  return await fs.readFile(path.join(dir, file), 'utf8');
}