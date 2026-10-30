'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { ROOT } = require('../scripts/lib/icons');

test('Changesets versions all three packages, writes changelogs and consumes the release note', async () => {
  await fs.mkdir(path.join(ROOT, '.artifacts'), { recursive: true });
  const temp = await fs.mkdtemp(path.join(ROOT, '.artifacts/release-version-'));
  try {
    for (const file of ['package.json', 'pnpm-workspace.yaml']) await fs.copyFile(path.join(ROOT, file), path.join(temp, file));
    await fs.mkdir(path.join(temp, '.changeset'));
    await fs.copyFile(path.join(ROOT, '.changeset/config.json'), path.join(temp, '.changeset/config.json'));
    const originals = [];
    for (const kind of ['core', 'react', 'vue']) {
      const dir = path.join(temp, 'packages', kind);
      await fs.mkdir(dir, { recursive: true });
      const pkg = JSON.parse(await fs.readFile(path.join(ROOT, 'packages', kind, 'package.json'), 'utf8'));
      originals.push({ kind, pkg });
      await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
    }
    await fs.writeFile(path.join(temp, '.changeset/release-fixture.md'), `---\n${originals.map(({pkg}) => `"${pkg.name}": patch`).join('\n')}\n---\n\nVerify automatic release versioning.\n`);
    execFileSync(process.execPath, [path.join(ROOT, 'node_modules/@changesets/cli/bin.js'), 'version'], { cwd: temp, encoding: 'utf8' });
    for (const { kind, pkg } of originals) {
      const updated = JSON.parse(await fs.readFile(path.join(temp, 'packages', kind, 'package.json'), 'utf8'));
      const [major, minor, patch] = pkg.version.split('.').map(Number);
      assert.equal(updated.version, `${major}.${minor}.${patch + 1}`);
      assert.equal(updated.name, pkg.name);
      if (kind !== 'core') assert.equal(updated.dependencies['@iran-utils/iranian-banks-icons-core'], 'workspace:*');
      const changelog = await fs.readFile(path.join(temp, 'packages', kind, 'CHANGELOG.md'), 'utf8');
      assert.ok(changelog.includes(updated.version));
      assert.ok(changelog.includes('Verify automatic release versioning.'));
    }
    await assert.rejects(fs.access(path.join(temp, '.changeset/release-fixture.md')), { code: 'ENOENT' });
  } finally { await fs.rm(temp, { recursive: true, force: true }); }
});
