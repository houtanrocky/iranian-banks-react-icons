'use strict';
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { build } = require('esbuild');
const { ROOT } = require('./lib/icons');

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout: 180000 });
  if (result.error || result.status !== 0) throw new Error(`${command} failed: ${result.error || result.stdout + result.stderr}`);
  return result.stdout;
}

async function main() {
  if (!process.env.npm_execpath) throw new Error('Run this check with pnpm test:packages');
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'iranian-icons-consumer-'));
  try {
    for (const kind of ['core', 'react', 'vue']) {
      run(process.execPath, [process.env.npm_execpath, '--dir', path.join(ROOT, 'packages', kind), 'pack', '--pack-destination', temp], ROOT);
    }
    const tarballs = (await fs.readdir(temp)).filter(file => file.endsWith('.tgz')).map(file => path.join(temp, file));
    if (tarballs.length !== 3) throw new Error('Expected three package tarballs');
    await fs.writeFile(path.join(temp, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
    const reactMajor = process.env.TEST_REACT_MAJOR || '19';
    const vueVersion = process.env.TEST_VUE_VERSION || '3';
    // Invoke npm's JavaScript CLI directly so paths with spaces never pass through a shell.
    const directories = [path.dirname(process.execPath), ...(process.env.PATH || '').split(path.delimiter)];
    let npmCli;
    for (const directory of directories) {
      const candidate = process.platform === 'win32' ? path.join(directory, 'node_modules/npm/bin/npm-cli.js') : path.join(directory, 'npm');
      try { npmCli = await fs.realpath(candidate); break; } catch { /* Try the next PATH entry. */ }
    }
    if (!npmCli) throw new Error('Cannot locate the npm CLI for isolated consumer tests');
    run(process.execPath, [npmCli, 'install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', ...tarballs,
      `react@${reactMajor}`, `react-dom@${reactMajor}`, `@types/react@${reactMajor}`, `@types/react-dom@${reactMajor}`, `vue@${vueVersion}`, `@vue/server-renderer@${vueVersion}`, 'typescript@^5.9.3'], temp);
    const smoke = `
      import assert from 'node:assert/strict';
      import fs from 'node:fs';
      import { createRequire } from 'node:module';
      import * as React from 'react';
      import { h } from 'vue';
      import * as core from '@iran-utils/iranian-banks-icons-core';
      import * as react from '@iran-utils/iranian-banks-react-icons';
      import * as vue from '@iran-utils/iranian-banks-vue-icons';
      const require = createRequire(import.meta.url);
      const ReactDOMServer = require('react-dom/server');
      const { renderToString } = require('@vue/server-renderer');
      for (const [suffix, module] of [['icons-core',core],['react-icons',react],['vue-icons',vue]]) {
        const cjs = require('@iran-utils/iranian-banks-' + suffix);
        assert.equal(Object.keys(module).length, 117);
        assert.deepEqual(Object.keys(cjs).sort(), Object.keys(module).sort());
        const dir = 'node_modules/@iran-utils/iranian-banks-' + suffix;
        assert.match(fs.readFileSync(dir + '/LICENSE','utf8'), /MIT License/);
        assert.ok(fs.readFileSync(dir + '/README.md','utf8').includes('houtanrocky'));
        const pkg = JSON.parse(fs.readFileSync(dir + '/package.json','utf8'));
        if (pkg.dependencies) assert.ok(!JSON.stringify(pkg.dependencies).includes('workspace:'));
      }
      for (const name of Object.keys(core)) {
        assert.ok(ReactDOMServer.renderToStaticMarkup(React.createElement(react[name], {width:48})).includes(core[name].viewBox));
        assert.ok((await renderToString(h(vue[name], {width:48}))).includes(core[name].viewBox));
      }
      console.log('Packed ESM/CommonJS and SSR checks passed for React ' + React.version);
    `;
    await fs.writeFile(path.join(temp, 'smoke.mjs'), smoke);
    console.log(run(process.execPath, ['smoke.mjs'], temp).trim());
    for (const file of ['react.tsx', 'vue.ts', 'core.ts']) {
      let contracts = await fs.readFile(path.join(ROOT, 'tests/types', file), 'utf8');
      for (const [kind, suffix] of [['core', 'icons-core'], ['react', 'react-icons'], ['vue', 'vue-icons']]) {
        contracts = contracts.replaceAll(`../../packages/${kind}`, `@iran-utils/iranian-banks-${suffix}`);
      }
      await fs.writeFile(path.join(temp, file), contracts);
    }
    for (const file of ['tsconfig.json', 'tsconfig.vue.json']) await fs.copyFile(path.join(ROOT, 'tests/types', file), path.join(temp, file));
    run(process.execPath, [path.join(temp, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.json'], temp);
    const vueTypeArgs = [path.join(temp, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.vue.json'];
    if (vueVersion === '3.0.0') {
      // Vue 3.0's own declarations predate TS 5 and contain an unconstrained renderer generic.
      // Still check our public component usage; current Vue runs with library checks enabled.
      vueTypeArgs.push('--skipLibCheck');
      console.log('Vue 3.0: checking consumer usage with skipLibCheck for upstream TS 5 incompatibility');
    }
    run(process.execPath, vueTypeArgs, temp);
    for (const suffix of ['icons-core', 'react-icons', 'vue-icons']) {
      const result = await build({ stdin: { contents: `export { BluBankIcon } from '@iran-utils/iranian-banks-${suffix}';`, resolveDir: temp },
        bundle: true, write: false, minify: true, format: 'esm', platform: 'browser', external: ['react', 'vue'] });
      const bytes = result.outputFiles[0].contents.length;
      if (bytes > 12000) throw new Error(`Tree shaking failed: ${suffix} single-icon bundle is ${bytes} bytes`);
      console.log(`${suffix}: single-icon bundle ${bytes} bytes (framework external)`);
    }
  } finally {
    if (process.env.KEEP_PACKAGE_FIXTURE) console.log(`Retained consumer: ${temp}`);
    else await fs.rm(temp, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
