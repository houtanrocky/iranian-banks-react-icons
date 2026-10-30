'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { minify } = require('terser');
const { ROOT, readIcons } = require('./icons');
const { createReactIcon, createVueIcon } = require('./factories');

function declarations(kind, icons) {
  const contracts = {
    core: ['export interface SvgIconData {\n  viewBox: string;\n  content: string;\n}', 'SvgIconData'],
    react: ["import type { SVGProps, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';\nexport type IconProps = SVGProps<SVGSVGElement>;", 'ForwardRefExoticComponent<PropsWithoutRef<IconProps> & RefAttributes<SVGSVGElement>>'],
    vue: ["import type { DefineComponent, SVGAttributes } from 'vue';\nexport type IconProps = SVGAttributes & { [key: string]: unknown };", 'DefineComponent<IconProps>'],
  };
  const [header, type] = contracts[kind];
  return header + '\n' + icons.map(({ name }) => `export declare const ${name}: ${type};`).join('\n') + '\n';
}

async function moduleSource(kind, format, icons) {
  const esm = format === 'esm';
  if (kind === 'core') {
    return (esm ? '' : "'use strict';\n") + icons.map(({ name, viewBox, content }) =>
      `${esm ? 'export const ' : 'exports.'}${name} = ${JSON.stringify({ viewBox, content })};`
    ).join('\n') + '\n';
  }
  const react = kind === 'react';
  const runtime = react ? 'React' : 'Vue';
  const factory = react ? createReactIcon : createVueIcon;
  const imports = esm
    ? `import * as ${runtime} from '${kind}';\nimport { ${icons.map(({ name }, i) => `${name} as d${i}`).join(', ')} } from '@iran-utils/iranian-banks-icons-core';`
    : `'use strict';\nvar ${runtime} = require('${kind}');\nvar core = require('@iran-utils/iranian-banks-icons-core');`;
  const exports = icons.map(({ name }, i) =>
    `${esm ? 'export var ' : 'exports.'}${name} = /*#__PURE__*/${factory.name}(${esm ? `d${i}` : `core.${name}`}, '${name}');`
  ).join('\n');
  const result = await minify([imports, factory.toString(), exports].join('\n'), {
    module: esm,
    // Preserve pure annotations so consumers can remove unused component factories.
    format: { preserve_annotations: true },
  });
  if (!result.code) throw new Error(`Empty ${kind}/${format} build`);
  return result.code + '\n';
}

async function buildPackage(kind) {
  if (!['core', 'react', 'vue'].includes(kind)) throw new Error(`Unknown package: ${kind}`);
  // Validate input before replacing existing output.
  const icons = await readIcons();
  const types = declarations(kind, icons);
  const sources = await Promise.all(['esm', 'cjs'].map(format => moduleSource(kind, format, icons)));
  const pkg = path.join(ROOT, 'packages', kind);
  const out = path.join(pkg, 'dist');
  await fs.rm(out, { recursive: true, force: true });
  await Promise.all(['esm', 'cjs'].map(async (format, i) => {
    const target = path.join(out, format);
    await fs.mkdir(target, { recursive: true });
    await Promise.all([
      fs.writeFile(path.join(target, 'index.js'), sources[i]),
      fs.writeFile(path.join(target, 'index.d.ts'), types),
      fs.writeFile(path.join(target, 'package.json'), JSON.stringify({ type: format === 'esm' ? 'module' : 'commonjs' }) + '\n'),
    ]);
  }));
  await fs.writeFile(path.join(pkg, 'index.d.ts'), types);
  if (kind === 'core') {
    await fs.writeFile(path.join(out, 'manifest.json'), JSON.stringify(Object.fromEntries(icons.map(({name, file}) => [name, file])), null, 2) + '\n');
  }
  await fs.copyFile(path.join(ROOT, 'LICENSE'), path.join(pkg, 'LICENSE'));
  console.log(`${kind}: built ${icons.length} icons (ESM, CommonJS, TypeScript)`);
}

module.exports = { buildPackage, declarations, moduleSource };
