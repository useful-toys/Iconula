// Copyright (c) 2026 Daniel Felix Ferber

import { defineConfig, devices } from '@playwright/test'

// Config padrão/oficial (`npm run test:e2e`, ADR 0010): builda o mesmo
// bundle que vai para preview/produção (`vite build`) e serve com
// `vite preview` — não `vite dev`, que é só o atalho de iteração de
// `playwright.dev.config.js`. `webServer` sobe e derruba o servidor
// sozinho; os emuladores do Firebase (Auth e Firestore) são
// responsabilidade do script npm, que envolve `playwright test` com
// `firebase emulators:exec` (ver package.json).
const PORTA = 4173

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: `http://localhost:${PORTA}`,
  },
  webServer: {
    command: `vite build && vite preview --port ${PORTA} --strictPort`,
    url: `http://localhost:${PORTA}`,
    // Ligada só aqui e em `playwright.dev.config.js` — nunca em
    // `npm run dev`, `npm run preview` ou `npm run build` chamados
    // diretamente, porque a variável nunca é definida fora desse
    // ambiente (ADR 0010).
    env: { VITE_USE_FIREBASE_EMULATOR: '1' },
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
