'use strict';

const fs = require('node:fs/promises');
const { execFileSync } = require('node:child_process');
const PACKAGE_NAMES = new Set([
  '@iran-utils/iranian-banks-icons-core',
  '@iran-utils/iranian-banks-react-icons',
  '@iran-utils/iranian-banks-vue-icons',
]);

function releasePlan({ branch, sourceSha, latestSha, releases, resumePublish = false }) {
  if (!Array.isArray(releases)) throw new Error('Invalid Changesets release plan');
  if (branch !== 'main') return { release: false, version: false, reason: 'Only main can publish stable packages.' };
  if (!sourceSha || !latestSha || sourceSha !== latestSha) {
    return { release: false, version: false, reason: 'A newer main commit exists; wait for its CI run.' };
  }
  const pending = releases.filter(entry => entry.type !== 'none' && entry.oldVersion !== entry.newVersion);
  for (const entry of pending) {
    if (!PACKAGE_NAMES.has(entry.name)) throw new Error(`Unexpected package in release plan: ${entry.name}`);
    if (!['patch', 'minor', 'major'].includes(entry.type)) throw new Error(`Invalid version bump for ${entry.name}`);
  }
  if (resumePublish && pending.length) throw new Error('Cannot resume an already-versioned release while changesets remain. Run normally instead.');
  if (resumePublish) return { release: true, version: false, reason: 'Retry publishing committed versions without bumping again.' };
  if (!pending.length) return { release: false, version: false, reason: 'No package version changes; skip npm publishing.' };
  return { release: true, version: true, reason: `Version and publish ${pending.length} package(s) from changesets.` };
}

async function main() {
  const event = JSON.parse(await fs.readFile(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const plan = JSON.parse(await fs.readFile('.artifacts/release-plan.json', 'utf8'));
  const result = releasePlan({
    branch: event.workflow_run?.head_branch || process.env.GITHUB_REF_NAME,
    sourceSha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    latestSha: execFileSync('git', ['rev-parse', 'FETCH_HEAD'], { encoding: 'utf8' }).trim(),
    releases: plan.releases,
    resumePublish: process.env.RESUME_PUBLISH === 'true',
  });
  console.log(result.reason);
  if (process.env.GITHUB_OUTPUT) {
    await fs.appendFile(process.env.GITHUB_OUTPUT, `release=${result.release}\nversion=${result.version}\n`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `## Stable npm release\n\n${result.reason}\n`);
}

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { releasePlan };
