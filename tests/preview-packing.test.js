'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { Readable } = require('node:stream');
const { spawn, execFileSync } = require('node:child_process');
const { ROOT } = require('../scripts/lib/icons');

test('the pinned preview CLI packs all three packages with matching core URLs and restores manifests', { timeout: 120000 }, async () => {
  await fs.mkdir(path.join(ROOT, '.artifacts'), { recursive: true });
  const temp = await fs.mkdtemp(path.join(ROOT, '.artifacts/preview-pack-'));
  const sha = 'a'.repeat(40);
  const names = ['icons-core', 'react-icons', 'vue-icons'].map(suffix => `@iran-utils/iranian-banks-${suffix}`);
  const manifests = new Map();
  const original = new Map();
  let requestError;
  let uploadCount = 0;
  let origin;
  const server = http.createServer(async (request, response) => {
    try {
      if (request.url === '/check') {
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ sha }));
      } else if (request.url === '/publish' && request.method === 'POST') {
        uploadCount++;
        assert.equal(request.headers['sb-comment'], 'off');
        const form = await new Request(`${origin}/publish`, { method: 'POST', headers: request.headers,
          body: Readable.toWeb(request), duplex: 'half' }).formData();
        for (const [key, value] of form) {
          assert.ok(key.startsWith('package:'), 'No templates or unrelated artifacts should be uploaded');
          const archive = path.join(temp, `upload-${manifests.size}.tgz`);
          await fs.writeFile(archive, Buffer.from(await value.arrayBuffer()));
          const pkg = JSON.parse(execFileSync('tar', ['-xOzf', archive, 'package/package.json'], { encoding: 'utf8' }));
          manifests.set(pkg.name, pkg);
        }
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ debug: {}, urls: names.map(name => `${origin}/houtanrocky/iranian-banks-react-icons/${name}@${sha}`) }));
      } else { response.writeHead(404).end(); }
    } catch (error) { requestError = error; response.writeHead(400).end('Invalid test upload'); }
  });
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    origin = `http://127.0.0.1:${server.address().port}`;
    for (const kind of ['core', 'react', 'vue']) {
      const target = path.join(temp, 'packages', kind);
      await fs.cp(path.join(ROOT, 'packages', kind), target, {
        recursive: true, filter: source => !source.split(path.sep).includes('node_modules'),
      });
      original.set(kind, await fs.readFile(path.join(target, 'package.json'), 'utf8'));
    }
    await fs.writeFile(path.join(temp, 'package.json'), JSON.stringify({ private: true, packageManager: 'pnpm@10.13.1' }));
    await fs.writeFile(path.join(temp, 'pnpm-workspace.yaml'), "packages:\n  - 'packages/*'\n");
    const child = spawn(process.execPath, [path.join(ROOT, 'node_modules/pkg-pr-new/bin/cli.js'), 'publish',
      '--pnpm', '--previewVersion', '--no-compact', '--no-template', '--comment=off', '--json', 'previews.json',
      './packages/core', './packages/react', './packages/vue'], {
      cwd: temp, timeout: 90000,
      env: { ...process.env, TEST: 'true', API_URL: origin, GITHUB_EVENT_NAME: 'pull_request',
        GITHUB_REPOSITORY: 'houtanrocky/iranian-banks-react-icons', GITHUB_RUN_ID: '1', GITHUB_RUN_ATTEMPT: '1',
        GITHUB_ACTOR_ID: '1', GITHUB_OUTPUT: path.join(temp, 'outputs.txt') },
    });
    let output = '';
    child.stdout.on('data', data => { output += data; });
    child.stderr.on('data', data => { output += data; });
    const code = await new Promise((resolve, reject) => { child.on('error', reject); child.on('close', resolve); });
    if (requestError) throw requestError;
    assert.equal(code, 0, output);
    assert.equal(uploadCount, 1);
    assert.equal(manifests.size, 3);
    for (const name of names) assert.equal(manifests.get(name).version, '0.0.0-preview-aaaaaaa');
    const coreUrl = `${origin}/houtanrocky/iranian-banks-react-icons/${names[0]}@${sha}`;
    for (const name of names.slice(1)) assert.equal(manifests.get(name).dependencies[names[0]], coreUrl);
    for (const [kind, source] of original) assert.equal(await fs.readFile(path.join(temp, 'packages', kind, 'package.json'), 'utf8'), source);
    const metadata = JSON.parse(await fs.readFile(path.join(temp, 'previews.json'), 'utf8'));
    assert.equal(metadata.packages.length, 3);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await fs.rm(temp, { recursive: true, force: true });
  }
});
