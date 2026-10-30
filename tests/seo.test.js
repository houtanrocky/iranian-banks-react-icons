'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const canonical = 'https://houtanrocky.github.io/iranian-banks-react-icons/';

test('search and social metadata share one canonical project identity', () => {
  const html = fs.readFileSync('apps/docs/index.html', 'utf8');
  const { document } = new JSDOM(html).window;
  assert.equal(document.querySelectorAll('meta[charset]').length, 1);
  assert.equal(document.querySelectorAll('h1').length, 0); // Content is inserted by the prerender build.
  assert.equal(document.querySelector('html').lang, 'en');
  assert.match(document.title, /Iranian Bank Icons.*React.*Vue/);
  assert.equal(document.querySelector('link[rel="canonical"]').href, canonical);
  assert.equal(document.querySelector('meta[property="og:url"]').content, canonical);
  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    assert.equal(document.querySelector(selector).content, canonical + 'social-card.png');
  }
  const schema = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@graph'][1].codeRepository, 'https://github.com/houtanrocky/iranian-banks-react-icons');
  assert.doesNotMatch(html, /houtan-rocky|aggregateRating|reviewCount/);
});

test('npm metadata, license and keywords link users to the real repository', () => {
  for (const kind of ['core', 'react', 'vue']) {
    const pkg = require(`../packages/${kind}/package.json`);
    assert.equal(pkg.homepage, canonical);
    assert.equal(pkg.repository.directory, `packages/${kind}`);
    assert.equal(pkg.bugs.url, 'https://github.com/houtanrocky/iranian-banks-react-icons/issues');
    assert.equal(pkg.license, 'MIT');
    assert.equal(pkg.sideEffects, false);
    assert.ok(pkg.files.includes('LICENSE'));
    assert.ok(pkg.keywords.includes('iranian-bank-icons'));
  }
});

test('sitemap, robots, social card and tool summary are internally consistent', () => {
  const xml = new JSDOM(fs.readFileSync('apps/docs/public/sitemap.xml', 'utf8'), { contentType: 'application/xml' });
  assert.equal(xml.window.document.querySelector('loc').textContent, canonical);
  assert.ok(fs.readFileSync('apps/docs/public/robots.txt', 'utf8').includes(`Sitemap: ${canonical}sitemap.xml`));
  assert.ok(fs.readFileSync('apps/docs/public/llms.txt', 'utf8').includes(canonical));
  const svg = new JSDOM(fs.readFileSync('apps/docs/public/social-card.svg', 'utf8'), { contentType: 'image/svg+xml' }).window.document.documentElement;
  assert.equal(svg.getAttribute('width'), '1200');
  assert.equal(svg.getAttribute('height'), '630');
});
