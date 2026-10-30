import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import files from '../../packages/core/dist/manifest.json';

test('every SVG asset is published under the project base path', async ({ request }) => {
  for (const file of Object.values(files)) {
    const response = await request.get(`icons/${encodeURIComponent(file)}`);
    expect(response.status(), file).toBe(200);
    expect(response.headers()['content-type']).toContain('image/svg+xml');
    expect(await response.text()).toContain('<svg');
  }
});

test('prerendered catalog and SEO work without JavaScript', async ({ browser, request }) => {
  const response = await request.get('./');
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('Find a familiar face.');
  expect(html).toContain('Bank Melli');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/iranian-banks-react-icons/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Iranian bank icons.Ready for your next build.');
  await expect(page.locator('.icon-card')).toHaveCount(59);
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe('https://houtanrocky.github.io/iranian-banks-react-icons/');
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(schema['@graph'].map((entry: { '@type': string }) => entry['@type'])).toEqual(['WebSite', 'SoftwareSourceCode']);
  await context.close();
  for (const file of ['sitemap.xml', 'robots.txt', 'llms.txt', 'favicon.svg', 'social-card.png']) {
    expect((await request.get(file)).status()).toBe(200);
  }
});

test('search, categories, variants, sizes and reset preserve gallery behavior', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await expect(page.locator('.icon-card')).toHaveCount(59);
  await page.getByRole('searchbox', { name: 'Search icons' }).fill('ملي');
  await expect(page.locator('.icon-card')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Copy Bank Melli React import' })).toBeVisible();
  await page.getByRole('searchbox').fill('');
  await page.getByRole('group', { name: 'Icon category' }).getByRole('button', { name: 'Payment' }).click();
  await expect(page.locator('.icon-card')).toHaveCount(11);
  await page.getByRole('button', { name: 'Mono', exact: true }).click();
  await expect(page.locator('.icon-card')).toHaveCount(10);
  await expect(page.getByRole('button', { name: /Copy SnappPay/ })).toHaveCount(0);
  await page.getByRole('slider', { name: 'Size' }).fill('96');
  await expect(page.locator('.icon-card img').first()).toHaveAttribute('width', '96');
  await page.getByRole('searchbox').fill('no such icon');
  await expect(page.getByRole('heading', { name: 'No matching icons' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.locator('.icon-card')).toHaveCount(59);
  expect(errors).toEqual([]);
});

test('framework switch updates installation, examples and copied imports', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (text: string) => { (window as unknown as { copied: string }).copied = text; },
    } });
  });
  await page.goto('./');
  await page.getByRole('button', { name: 'Vue', exact: true }).click();
  await expect(page.locator('.install-box')).toContainText('npm install @iran-utils/iranian-banks-vue-icons');
  await page.getByRole('button', { name: 'Copy install command' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { copied: string }).copied)).toBe('npm install @iran-utils/iranian-banks-vue-icons');
  await page.getByRole('button', { name: 'Copy Bank Mellat Vue import' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { copied: string }).copied)).toContain('MellatColorIcon, MellatIcon');
  await expect(page.getByRole('status', { name: 'Clipboard feedback' })).toHaveText('Copied to clipboard.');
  await page.getByRole('button', { name: 'Core / SVG', exact: true }).click();
  await expect(page.locator('.install-box')).toContainText('@iran-utils/iranian-banks-icons-core');
  await page.getByRole('button', { name: 'Copy example' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { copied: string }).copied)).toContain('const { viewBox, content }');
});

test('clipboard failure gives honest feedback', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied'); } } });
  });
  await page.goto('./');
  await page.getByRole('button', { name: 'Copy install command' }).click();
  await expect(page.getByRole('status', { name: 'Clipboard feedback' })).toHaveText('Copy unavailable. Select and copy the code manually.');
});

test('gallery images resolve, mobile layout fits and accessibility checks pass', async ({ page }) => {
  const failures: string[] = [];
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto('./');
  await page.getByRole('button', { name: 'Copy Bank Melli React import' }).scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.icon-card img').first().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
  expect(failures).toEqual([]);
  // Scroll through each row so lazy assets are present in the full-page QA screenshot.
  for (const card of await page.locator('.icon-card').all()) await card.scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.icon-card img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await page.screenshot({ path: `.artifacts/showcase-${test.info().project.name}.png`, fullPage: true });
});
