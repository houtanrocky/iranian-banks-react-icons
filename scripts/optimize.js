'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { optimize } = require('svgo');
const config = require('../svgo.config');
const { ROOT, parseSvg } = require('./lib/icons');

async function optimizeIcons() {
  const raw = path.join(ROOT, 'raw');
  const output = path.join(ROOT, 'optimized');
  const files = (await fs.readdir(raw)).filter(file => file.endsWith('.svg')).sort();
  const results = await Promise.all(files.map(async file => {
    const source = await fs.readFile(path.join(raw, file), 'utf8');
    let { data } = optimize(source, { ...config, path: file });
    if (!file.endsWith('-color.svg')) {
      // Black is the default SVG fill. Let the root fill prop inherit into mono paths.
      data = data.replace(/\sfill="(?:#000(?:000)?|black)"/gi, '');
      data = data.replace(/<svg\b[^>]*>/, root => root.replace(/\sfill="none"/, ''));
    }
    parseSvg(data);
    return { file, data };
  }));
  await fs.rm(output, { recursive: true, force: true });
  await fs.mkdir(output, { recursive: true });
  await Promise.all(results.map(({ file, data }) => fs.writeFile(path.join(output, file), data)));
  console.log(`Optimized ${results.length} SVGs`);
}

if (require.main === module) optimizeIcons().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { optimizeIcons };
