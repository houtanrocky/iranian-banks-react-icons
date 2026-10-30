'use strict';

const fs = require('node:fs/promises');

const PACKAGE_NAMES = [
  '@iran-utils/iranian-banks-icons-core',
  '@iran-utils/iranian-banks-react-icons',
  '@iran-utils/iranian-banks-vue-icons',
];

function previewSummary(metadata) {
  if (!Array.isArray(metadata.packages) || metadata.packages.length !== PACKAGE_NAMES.length) {
    throw new Error('Expected previews for core, React and Vue');
  }
  const previews = PACKAGE_NAMES.map(name => {
    const entries = metadata.packages.filter(entry => entry.name === name);
    if (entries.length !== 1) throw new Error(`Missing or duplicated package preview: ${name}`);
    const url = new URL(entries[0].url);
    if (url.origin !== 'https://pkg.pr.new' || url.username || url.password || url.hash || url.search) {
      throw new Error(`Unexpected preview URL for ${name}`);
    }
    if (!/^\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/@iran-utils\/[a-zA-Z0-9-]+@[a-f0-9]{7,40}$/.test(url.pathname)) {
      throw new Error(`Expected a repository-qualified commit URL for ${name}`);
    }
    return { name, url: url.href };
  });
  return '# Package previews\n\n' +
    'Install a preview to try this commit before the next npm release. React and Vue previews depend on the matching core preview.\n\n' +
    previews.map(({ name, url }) => `## ${name}\n\n\`\`\`sh\nnpm install ${url}\n\`\`\`\n`).join('\n') +
    '\nPreview packages use a separate version and do not publish a new npm release. To return to stable, reinstall the package by its npm name and update your lockfile.\n';
}

async function main() {
  const metadata = JSON.parse(await fs.readFile('.artifacts/package-previews.json', 'utf8'));
  const summary = previewSummary(metadata);
  if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
  else process.stdout.write(summary);
}

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { previewSummary };
