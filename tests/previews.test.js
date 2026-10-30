'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { previewSummary } = require('../scripts/preview-summary');

function metadata() {
  return { packages: ['icons-core', 'react-icons', 'vue-icons'].map(suffix => ({
    name: `@iran-utils/iranian-banks-${suffix}`,
    url: `https://pkg.pr.new/houtanrocky/iranian-banks-react-icons/@iran-utils/iranian-banks-${suffix}@abcdef1234567890`,
  })) };
}

test('preview summary contains install commands for all three commit-qualified packages', () => {
  const input = metadata();
  const summary = previewSummary(input);
  for (const pkg of input.packages) assert.ok(summary.includes(`npm install ${pkg.url}`));
  assert.match(summary, /matching core preview/);
  assert.match(summary, /return to stable/);
});

test('preview summary rejects missing, duplicate or unexpected packages and unsafe links', () => {
  assert.throws(() => previewSummary({}), /Expected previews/);
  assert.throws(() => previewSummary({ packages: [] }), /Expected previews/);
  const duplicate = metadata();
  duplicate.packages[1] = duplicate.packages[0];
  assert.throws(() => previewSummary(duplicate), /Missing or duplicated/);
  for (const url of ['https://example.com/package', 'javascript:alert(1)',
    'https://user@pkg.pr.new/package', 'https://pkg.pr.new/pkg@latest',
    'https://pkg.pr.new/pkg@abcdef1#injected', 'https://pkg.pr.new/pkg@abcdef1?injected']) {
    const input = metadata();
    input.packages[0].url = url;
    assert.throws(() => previewSummary(input));
  }
});
