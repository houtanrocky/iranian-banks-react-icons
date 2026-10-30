'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const { ROOT } = require('./lib/icons');

async function main() {
  const publicDir = path.join(ROOT, 'apps/docs/public');
  const output = path.join(publicDir, 'icons');
  await fs.rm(output, { recursive: true, force: true });
  await fs.cp(path.join(ROOT, 'optimized'), output, { recursive: true });
  await sharp(path.join(publicDir, 'social-card.svg')).png().toFile(path.join(publicDir, 'social-card.png'));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
