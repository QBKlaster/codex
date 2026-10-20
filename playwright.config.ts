import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    viewport: { width: 1440, height: 1000 },
    launchOptions: { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
})
