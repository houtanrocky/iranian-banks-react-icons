'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { ROOT, componentName, parseSvg, readIcons } = require('../scripts/lib/icons');
const { moduleSource } = require('../scripts/lib/build');

test('legacy filenames retain their public export names', () => {
  for (const [file, name] of [
    ['bank markazi-color.svg', 'BankMarkaziColorIcon'], ['noor-.svg', 'NoorIcon'],
    ['pasargad-.svg', 'PasargadIcon'], ['pasargad pep-color.svg', 'PasargadPepColorIcon'],
    ['sepah-merged-mehr eghtesad.svg', 'SepahMergedMehrEghtesadIcon'],
  ]) assert.equal(componentName(file), name);
});

test('SVG parser accepts quoted viewBoxes and rejects invalid or active input', () => {
  assert.deepEqual(parseSvg("<svg viewBox='0 0 48 48'><path d='M0 0h1v1z'/></svg>"),
    { viewBox: '0 0 48 48', content: "<path d='M0 0h1v1z'/>" });
  for (const svg of [
    '', '<svg/>', '<svg><path/></svg>', '<svg viewBox="0 0 -1 4"><path/></svg>',
    '<svg viewBox="0 0 NaN 4"><path/></svg>', '<svg viewBox="0 0 4 4"><path></svg>',
    '<svg viewBox="0 0 4 4"><script>alert(1)</script></svg>',
    '<svg viewBox="0 0 4 4"><path onclick="alert(1)"/></svg>',
    '<svg viewBox="0 0 4 4"><image href="https://example.com/a.png"/></svg>',
  ]) assert.throws(() => parseSvg(svg));
});

test('all 117 original exports survive in ESM, CommonJS and declarations', async () => {
  const expected = JSON.parse((await fs.readFile(path.join(__dirname, 'fixtures/exports.json'), 'utf8')).replace(/^\uFEFF/, ''));
  const icons = await readIcons();
  assert.equal(icons.length, 117);
  assert.deepEqual(icons.map(icon => icon.name).sort(), [...expected].sort());
  for (const kind of ['core', 'react', 'vue']) {
    const dir = path.join(ROOT, 'packages', kind);
    const cjs = require(dir);
    const esm = await import(pathToFileURL(path.join(dir, 'dist/esm/index.js')).href);
    assert.deepEqual(Object.keys(cjs).sort(), [...expected].sort());
    assert.deepEqual(Object.keys(esm).sort(), [...expected].sort());
    const types = await fs.readFile(path.join(dir, 'index.d.ts'), 'utf8');
    for (const name of expected) assert.match(types, new RegExp(`export declare const ${name}:`));
    for (const format of ['esm', 'cjs']) assert.equal(await fs.readFile(path.join(dir, `dist/${format}/index.d.ts`), 'utf8'), types);
    if (kind === 'core') for (const icon of icons) assert.deepEqual(esm[icon.name], cjs[icon.name]);
  }
});

test('catalog rejects empty input and ambiguous export names', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'bank-icons-'));
  try {
    await assert.rejects(readIcons(dir), /No SVG/);
    await fs.writeFile(path.join(dir, 'foo-bar.svg'), '<svg viewBox="0 0 4 4"><path/></svg>');
    await fs.writeFile(path.join(dir, 'foo bar.svg'), '<svg viewBox="0 0 4 4"><path/></svg>');
    await assert.rejects(readIcons(dir), /Duplicate icon export/);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

test('generated core safely preserves quotes, backticks, backslashes and interpolation text', async () => {
  const icon = { name: 'SpecialIcon', viewBox: '0 0 1 1', content: '<text>"`\\${globalThis.untrusted}</text>' };
  const source = await moduleSource('core', 'esm', [icon]);
  const result = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  assert.equal(result.SpecialIcon.content, icon.content);
});

test('SVG definitions are unique across icons and every local reference resolves', async () => {
  const seen = new Set();
  for (const icon of await readIcons()) {
    const ids = [...icon.content.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, icon.file);
    for (const id of ids) { assert.ok(!seen.has(id), `ID collision: ${id}`); seen.add(id); }
    for (const match of icon.content.matchAll(/(?:url\(#([^)]*)\)|(?:xlink:)?href="#([^"]+)")/g)) {
      assert.ok(ids.includes(match[1] || match[2]), `Missing reference in ${icon.file}`);
    }
    if (!icon.name.endsWith('ColorIcon')) assert.doesNotMatch(icon.content, /fill="(?:#000(?:000)?|black)"/i);
  }
});
