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
    exclude: [...configDefaults.exclude, '.claude/**'],
  },
})
