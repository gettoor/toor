import fs from 'fs/promises';
import { RPEInsights } from '@gettoor/core';
import { Styles } from '@gettoor/core/console';
import { renderRPEInsightsToHTML } from '@gettoor/core/rpe-html-renderer';

export async function writeInsightsToFile(
  insights: RPEInsights,
  filenameCore: string,
): Promise<void> {
  const html = await renderRPEInsightsToHTML(insights);
  const htmlFilename = `${filenameCore}.html`;
  await fs.writeFile(htmlFilename, html);

  const json = JSON.stringify(insights, null, 2);
  const jsonFilename = `${filenameCore}.json`;
  await fs.writeFile(jsonFilename, json);

  console.log(
    `Insights written to ${Styles.highlight(htmlFilename)} ` +
    `and ${Styles.highlight(jsonFilename)}`
  );
}