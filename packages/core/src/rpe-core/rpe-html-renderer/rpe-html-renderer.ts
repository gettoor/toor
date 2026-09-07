import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { RPEInsights } from '../rpe-insights/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function renderRPEInsightsToHTML(
  insights: RPEInsights,
): Promise<string> {
  const html = await readFile(
    join(__dirname, 'templates', 'index.html'),
    'utf-8',
  );
  return html.replace('__RPE_INSIGHTS__', JSON.stringify(insights));
}