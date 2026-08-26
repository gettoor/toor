import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const faviconPath = join(__dirname, 'assets', 'favicon.png');
const distIndexHtmlPath = join(__dirname, 'dist', 'index.html');

const FAVICON_LINK_REGEX = /<link rel="icon"[^>]*>/;

async function embedData() {
  const favicon = await readFile(faviconPath);
  const base64 = favicon.toString('base64');
  const link = `<link rel="icon" type="image/png" href="data:image/png;base64,${base64}">`;

  const html = await readFile(distIndexHtmlPath, 'utf-8');
  const updatedHtml = FAVICON_LINK_REGEX.test(html)
    ? html.replace(FAVICON_LINK_REGEX, link)
    : html.replace('</head>', `    ${link}\n  </head>`);

  await writeFile(distIndexHtmlPath, updatedHtml);
}

async function copyIndexHtmlToCore() {
  const indexHtml = await readFile(distIndexHtmlPath, 'utf-8');
  const dstIndexHtmlPath = join(
    __dirname,
    '..',
    '..',
    'packages',
    'core',
    'src',
    'rpe',
    'rpe-html-renderer',
    'templates',
    'index.html',
  );
  console.log('Copying index.html to core...');
  await writeFile(dstIndexHtmlPath, indexHtml);
}

// TODO: delete me
async function embedRPEstate() {
  const rpeState = await readFile('../../state.json');
  const html = await readFile(distIndexHtmlPath, 'utf-8');
  const updatedHtml = html.replace('__RPE_STATE__', rpeState);
  await writeFile(join(__dirname, 'dist', 'index-with-rpe-state.html'), updatedHtml);
}

async function run() {
  await embedData();
  await copyIndexHtmlToCore();
  await embedRPEstate(); // TODO: delete me
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
