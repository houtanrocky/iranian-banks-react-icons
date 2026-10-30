'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const Module = require('node:module');
const path = require('node:path');

function loadTs(file) {
  const { outputFiles } = esbuild.buildSync({ entryPoints: [path.resolve(file)], bundle: true, write: false, platform: 'node', format: 'cjs' });
  const mod = new Module(file, module);
  mod._compile(outputFiles[0].text, file);
  return mod.exports;
}
const { filterIcons, normalizeSearch } = loadTs('apps/docs/src/search.ts');
const { ICONS } = loadTs('apps/docs/src/icons.ts');
const { usageExample, PACKAGES } = loadTs('apps/docs/src/site.ts');
const manifest = require('../packages/core/dist/manifest.json');

test('the catalog describes all 59 providers and all 117 package exports', () => {
  assert.equal(ICONS.length, 59);
  const names = ICONS.flatMap(icon => [icon.colorIcon, icon.monoIcon].filter(Boolean));
  assert.equal(new Set(names).size, 117);
  assert.deepEqual([...names].sort(), Object.keys(manifest).sort());
  assert.equal(ICONS.filter(icon => !icon.monoIcon)[0].key, 'SnappPay');
});

test('search supports names, exports, Persian, Arabic character variants and whitespace', () => {
  for (const query of ['melli', ' MELLI ', 'MelliIcon', 'ملی', 'ملي']) {
    assert.deepEqual(filterIcons(query, 'all', 'both').map(icon => icon.key), ['Melli']);
  }
  assert.equal(filterIcons('بانکینو', 'all', 'both')[0].key, 'Bankino');
  assert.equal(filterIcons('بانكينو', 'all', 'both')[0].key, 'Bankino');
  assert.equal(filterIcons('زرین‌پال', 'all', 'both')[0].key, 'Zarrinpal');
  assert.equal(normalizeSearch('  Bank Melli  '), 'bankmelli');
  assert.deepEqual(filterIcons('nothing-matches', 'all', 'both'), []);
});

test('category and variant filtering combine without blank color-only cards', () => {
  assert.equal(filterIcons('', 'banks', 'both').length, 38);
  assert.equal(filterIcons('', 'payment', 'color').length, 11);
  assert.equal(filterIcons('', 'psp', 'both').length, 3);
  assert.equal(filterIcons('', 'network', 'both').length, 2);
  assert.equal(filterIcons('', 'merged', 'both').length, 5);
  assert.equal(filterIcons('', 'all', 'mono').length, 58);
  assert.equal(filterIcons('Snapp', 'all', 'mono').length, 0);
  assert.equal(filterIcons('Melli', 'payment', 'both').length, 0);
});

test('each framework example and install target use the correct package', () => {
  for (const [framework, name] of Object.entries(PACKAGES)) assert.ok(usageExample(framework).includes(name));
  assert.match(usageExample('Vue'), /<script setup>/);
  assert.match(usageExample('Core'), /viewBox/);
  assert.match(usageExample('React'), /aria-label/);
});
