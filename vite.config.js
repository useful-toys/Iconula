// Copyright (c) 2026 Daniel Felix Ferber

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    // `.claude/worktrees/` guarda cópias de trabalho do Claude Code — são
    // checkouts de outras branches, com código antigo. Sem esta exclusão o
    // Vitest os coleta e a suíte falha por causa de arquivos que não fazem
    // parte da branch atual.
    //
    // `*.rules.test.js` são os testes das regras do Firestore: rodam em
    // Node contra o emulador, não em jsdom, e têm config e script
    // próprios (`npm run test:rules`) — ver TDR 0008.
    exclude: [...configDefaults.exclude, '.claude/**', '**/*.rules.test.js'],
  },
})
