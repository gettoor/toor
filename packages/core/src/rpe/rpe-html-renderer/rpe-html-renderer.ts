import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { RPEState } from '../rpe-state/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function renderRPEStateToHTML(state: RPEState): Promise<string> {
  const html = await readFile(
    join(__dirname, 'templates', 'index.html'),
    'utf-8',
  );
  return html.replace('__RPE_STATE__', JSON.stringify(state));
}