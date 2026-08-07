import { cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = join(__dirname, 'src');
const distDir = join(__dirname, 'dist');

async function copyResourceFiles() {
  console.log('Copying resource files...');
  await cp(srcDir, distDir, {
    recursive: true,
    filter: (src) =>
      src.endsWith('.eta') ||
      src.includes('.eta.') ||
      !src.includes('.'),
  });
}

async function run() {
  await copyResourceFiles();
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});