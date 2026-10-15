import { cp } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, 'src');
const distDir = join(__dirname, 'dist');

function isTypeScriptFile(src) {
  return ['.ts', '.tsx'].includes(extname(src));
}

async function copyResources() {
  console.log('Copying resource files...');
  await cp(srcDir, distDir, {
    recursive: true,
    force: true,
    filter: (src) => !isTypeScriptFile(src),
  });
}

copyResources().catch(error => {
  console.error(error);
  process.exit(1);
});
