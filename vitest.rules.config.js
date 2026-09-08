// Copyright (c) 2026 Daniel Felix Ferber

import { defineConfig } from "vitest/config";

// Config separada da de vite.config.js: os testes de regras rodam em
// Node (falam com o emulador do Firestore por rede), não em jsdom, e
// dependem do emulador estar no ar — por isso ficam fora do `npm test`
// e têm script próprio, `npm run test:rules`. Ver TDR 0008.
export default defineConfig({
  test: {
    environment: "node",
    include: ["firestore.rules.test.js"],
    // Subir o emulador e avaliar regras é mais lento que um teste de
    // unidade; o default de 5s estoura na primeira execução.
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});
