import { defineConfig, devices } from '@playwright/test';

// CHROME_PATH: własny Chromium (np. w chmurowym środowisku Claude); bez niego Playwright używa swojej przeglądarki
const executablePath = process.env.CHROME_PATH || undefined;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
    launchOptions: { executablePath },
  },
  projects: [
    { name: 'komputer', use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } } },
    { name: 'telefon', use: { ...devices['Pixel 7'], launchOptions: { executablePath } } },
  ],
  webServer: {
    // --ignore-lock: serwer na pierwszym planie także wtedy, gdy Astro wykryje agenta AI (inaczej startuje w tle)
    command: 'pnpm preview --port 4321 --ignore-lock',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
