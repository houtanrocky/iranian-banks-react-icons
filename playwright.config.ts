import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173/iranian-banks-react-icons/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], channel: process.env.PLAYWRIGHT_CHANNEL } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'], channel: process.env.PLAYWRIGHT_CHANNEL } },
  ],
  webServer: {
    command: 'pnpm --filter docs preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/iranian-banks-react-icons/',
    reuseExistingServer: false,
  },
});
