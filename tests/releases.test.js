'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { releasePlan } = require('../scripts/release-plan');
const input = (overrides = {}) => ({ branch: 'main', sourceSha: 'abc123', latestSha: 'abc123',
  releases: [{ name: '@iran-utils/iranian-banks-icons-core', type: 'patch', oldVersion: '1.0.4', newVersion: '1.0.5' }], ...overrides });

test('a changeset on the current main commit versions and publishes', () => {
  const plan = releasePlan(input());
  assert.equal(plan.release, true);
  assert.equal(plan.version, true);
});

test('documentation-only pushes and empty changesets do not publish', () => {
  for (const releases of [[], [{ name: 'docs', type: 'none', oldVersion: '0.0.0', newVersion: '0.0.0' }]]) {
    const plan = releasePlan(input({ releases }));
    assert.equal(plan.release, false);
    assert.equal(plan.version, false);
  }
});

test('feature branches, missing identity and stale CI runs cannot publish', () => {
  for (const overrides of [{ branch: 'feature/icons' }, { sourceSha: 'old', latestSha: 'new' }, { sourceSha: '' }, { latestSha: '' }]) {
    assert.equal(releasePlan(input(overrides)).release, false);
  }
});

test('explicit recovery retries committed versions without another bump', () => {
  assert.deepEqual(releasePlan(input({ releases: [], resumePublish: true })), {
    release: true, version: false, reason: 'Retry publishing committed versions without bumping again.',
  });
  assert.throws(() => releasePlan(input({ resumePublish: true })), /Cannot resume/);
});

test('unexpected packages, invalid bumps and malformed plans stop publishing', () => {
  assert.throws(() => releasePlan(input({ releases: undefined })), /Invalid Changesets/);
  assert.throws(() => releasePlan(input({ releases: [{name: 'other-package', type: 'patch', oldVersion: '1', newVersion: '2'}] })), /Unexpected package/);
  assert.throws(() => releasePlan(input({ releases: [{name: '@iran-utils/iranian-banks-icons-core', type: 'invalid', oldVersion: '1', newVersion: '2'}] })), /Invalid version bump/);
});
