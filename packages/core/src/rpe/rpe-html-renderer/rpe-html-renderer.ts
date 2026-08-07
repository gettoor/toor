import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Eta } from 'eta';
import { RPEState } from '../rpe-state/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function renderRPEStateToHTML(state: RPEState): Promise<string> {
  const eta = new Eta({
    views: join(__dirname, 'templates'),
  });
  const html = await eta.renderAsync(
    'index.eta.html',
    { state },
  );
  return html;
}