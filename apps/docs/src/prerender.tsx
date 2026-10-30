import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { renderToString } from 'react-dom/server';
import App from './App';

const file = resolve('dist/index.html');
const template = await readFile(file, 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('Prerender root is missing');
await writeFile(file, template.replace('<div id="root"></div>', () => `<div id="root">${renderToString(<App />)}</div>`));
console.log('Prerendered landing page, full icon catalog, usage guide, and FAQ.');
