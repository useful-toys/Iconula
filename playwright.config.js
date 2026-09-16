// Copyright (c) 2026 Daniel Felix Ferber

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
