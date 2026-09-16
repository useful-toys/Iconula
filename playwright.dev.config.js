// Copyright (c) 2026 Daniel Felix Ferber

import { defineConfig, devices } from '@playwright/test'

// Config de atalho (`npm run test:e2e:dev`, ADR 0010): serve com `vite`
// (dev server) em vez de buildar — só para iterar rápido escrevendo um
// teste novo; não substitui `playwright.config.js` (o padrão/oficial).
const PORTA = 5173

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: `http://localhost:${PORTA}`,
  },
  webServer: {
    command: `vite --port ${PORTA} --strictPort`,
    url: `http://localhost:${PORTA}`,
    // Ligada só aqui e em `playwright.config.js` — nunca em
    // `npm run dev` chamado diretamente (ADR 0010).
    env: { VITE_USE_FIREBASE_EMULATOR: '1' },
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
