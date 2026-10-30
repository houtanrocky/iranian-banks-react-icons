'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const camelcase = require('camelcase');
const { XMLValidator } = require('fast-xml-parser');

const ROOT = path.resolve(__dirname, '../..');

function componentName(file) {
  return camelcase(path.basename(file).replace(/\.svg$/i, ''), { pascalCase: true }) + 'Icon';
}

function parseSvg(svg) {
  const valid = XMLValidator.validate(svg);
  if (valid !== true) throw new Error(`Invalid SVG: ${valid.err.msg}`);
  const root = svg.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>\s*$/);
  if (!root || !root[2].trim()) throw new Error('SVG must contain a non-empty svg root');
  const viewBox = root[1].match(/\bviewBox\s*=\s*(["'])(.*?)\1/)?.[2];
  const bounds = viewBox?.trim().split(/[\s,]+/).map(Number);
  if (!bounds || bounds.length !== 4 || !bounds.every(Number.isFinite) || bounds[2] <= 0 || bounds[3] <= 0) {
    throw new Error('SVG must have a valid viewBox with positive dimensions');
  }
  if (/<(?:script|foreignObject|image)\b|\son\w+\s*=|(?:href\s*=\s*["']\s*(?:https?:|javascript:|data:))/i.test(svg)) {
    throw new Error('SVG contains active or external content');
  }
  return { viewBox, content: root[2].trim() };
}

async function readIcons(directory = path.join(ROOT, 'optimized')) {
  const files = (await fs.readdir(directory)).filter(file => /\.svg$/i.test(file)).sort();
  if (!files.length) throw new Error('No SVG icons found; run pnpm optimize first');
  const seen = new Set();
  return Promise.all(files.map(async file => {
    const name = componentName(file);
    if (seen.has(name)) throw new Error(`Duplicate icon export: ${name}`);
    seen.add(name);
    return { file, name, ...parseSvg(await fs.readFile(path.join(directory, file), 'utf8')) };
  }));
}

module.exports = { ROOT, componentName, parseSvg, readIcons };
