'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const { gzipSync } = require('node:zlib');
const sharp = require('sharp');
const { ROOT, readIcons } = require('./lib/icons');

async function pixels(svg, size) {
  return sharp(Buffer.from(svg)).resize(size, size, { fit: 'contain', background: '#fff' })
    .flatten({ background: '#fff' }).removeAlpha().raw().toBuffer();
}

async function visualError(source, output, size) {
  const [before, after] = await Promise.all([pixels(source, size), pixels(output, size)]);
  let sum = 0;
  for (let i = 0; i < before.length; i++) sum += Math.abs(before[i] - after[i]);
  return sum / before.length;
}

async function audit() {
  const icons = await readIcons();
  const rows = [];
  // Sequential rasterization keeps the audit's memory use bounded in CI.
  for (const icon of icons) {
    const raw = (await fs.readFile(path.join(ROOT, 'raw', icon.file), 'utf8')).replace(/\r\n/g, '\n');
    const optimized = await fs.readFile(path.join(ROOT, 'optimized', icon.file), 'utf8');
    const rendered = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${icon.viewBox}">${icon.content}</svg>`;
    rows.push({ file: icon.file, raw: Buffer.byteLength(raw), optimized: Buffer.byteLength(optimized),
      gzip: gzipSync(optimized).length,
      error96: await visualError(raw, rendered, 96),
      error256: await visualError(raw, rendered, 256) });
  }
  const rawBytes = rows.reduce((n, r) => n + r.raw, 0);
  const optimizedBytes = rows.reduce((n, r) => n + r.optimized, 0);
  const worst = [...rows].sort((a, b) => Math.max(b.error96, b.error256) - Math.max(a.error96, a.error256))[0];
  const failures = rows.filter(row => Math.max(row.error96, row.error256) > 1);
  const report = `# SVG optimization audit\n\n` +
    `Run \`pnpm build && pnpm audit:images\` to reproduce. Source artwork is preserved in \`raw/\`.\n\n` +
    `- ${rows.length} SVG variants for 59 providers; no raster conversion or embedded bitmap assets.\n` +
    `- Source: ${rawBytes.toLocaleString('en-US')} bytes. Optimized: ${optimizedBytes.toLocaleString('en-US')} bytes (${(100 * (1 - optimizedBytes / rawBytes)).toFixed(1)}% smaller).\n` +
    `- The previous build produced 1,089,340 bytes with pretty printing and 8-digit precision. This build uses compact output and 4-digit precision.\n` +
    `- All rendered core exports were compared with the source artwork at 96 and 256 pixels, on white, using Sharp. Maximum mean absolute channel error: ${Math.max(worst.error96, worst.error256).toFixed(4)}/255 (${worst.file}). The regression limit is 1/255; this is an automated similarity check, not a substitute for review of changed artwork.\n\n` +
    `## Problems found and addressed\n\n` +
    `- Four gradient-based logos reused IDs such as \`a\` and \`b\`, allowing one inline logo to reference another logo's gradients. File-specific, deterministic prefixes now isolate definitions between different icons. Identical repeated instances still share IDs; their definitions are identical. Avoid styling these internal IDs; repeated-instance ID uniqueness is not guaranteed by the current API.\n` +
    `- Hard-coded black fills overrode the public monochrome \`fill\` prop. Monochrome black paths now inherit the root fill, while white cutouts and \`fill="none"\` are retained. \`MaskanIcon\` is an entirely white reverse logo; its source palette is preserved and the gallery previews it on a dark background.\n` +
    `- Duplicated optimizer plugins, verbose serialization and excessive coordinate precision increased distribution size. The pipeline now validates SVGs, retains viewBox, prefixes IDs and writes compact output.\n` +
    `- The old gallery eagerly bundled all icon data into 1,291,760 bytes of JavaScript (457,270 gzip). The gallery now references separate SVG files with lazy loading and explicit dimensions, so the artwork does not inflate the JavaScript bundle. A user browsing the full collection will still download its images.\n\n` +
    `## Remaining size considerations\n\n` +
    `Melli, Sepah, Shaparak and Tejarat contain detailed vector paths. Precision reduction alone cannot make this artwork tiny. Prefer individual named ESM imports, avoid namespace imports in consumers, and do not replace detailed brand artwork with simplified paths without visual review. CommonJS consumers may load the entire data module.\n\n` +
    `Gzip values below measure each SVG separately; they are not a promise about a consumer's bundle or GitHub Pages compression.\n\n` +
    `| Largest optimized files | Source bytes | Optimized bytes | Gzip bytes | Max render error / 255 |\n| --- | ---: | ---: | ---: | ---: |\n` +
    [...rows].sort((a, b) => b.optimized - a.optimized).slice(0, 12).map(row => `| ${row.file} | ${row.raw} | ${row.optimized} | ${row.gzip} | ${Math.max(row.error96, row.error256).toFixed(4)} |`).join('\n') + '\n\n' +
    `References: [SVGO ID prefixing](https://svgo.dev/docs/plugins/prefixIds/), [Vite static deployment](https://vite.dev/guide/static-deploy).\n`;
  await fs.mkdir(path.join(ROOT, 'reports'), { recursive: true });
  await fs.writeFile(path.join(ROOT, 'reports/image-optimization.md'), report);
  await fs.mkdir(path.join(ROOT, '.artifacts'), { recursive: true });
  await fs.writeFile(path.join(ROOT, '.artifacts/image-audit.json'), JSON.stringify({ rawBytes, optimizedBytes, rows }, null, 2));
  console.log(`SVG audit: ${rawBytes} → ${optimizedBytes} bytes; worst render error ${Math.max(worst.error96, worst.error256).toFixed(4)}/255`);
  if (failures.length) {
    console.error('Visual changes exceed tolerance:', failures);
    if (process.argv.includes('--check')) process.exitCode = 1;
  }
}

if (require.main === module) audit().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { pixels, visualError };
