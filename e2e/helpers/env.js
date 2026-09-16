// Copyright (c) 2026 Daniel Felix Ferber

import { readFileSync } from 'node:fs';

/**
 * Lê `apiKey` e `projectId` de `.env.local` — a mesma config que
 * `vite build`/`vite preview`/`vite dev` carregam para o app (ver
 * `src/lib/firebase.js`). `login.js` e `fixture.js` precisam autenticar e
 * gravar no Firestore Emulator sob o **mesmo** projeto que o app usa:
 * `connectAuthEmulator`/`connectFirestoreEmulator` só redirecionam a rede
 * para `127.0.0.1`, sem trocar o `projectId` configurado no app — usar um
 * `projectId` diferente (ex.: `demo-iconula`, o do `--project` da linha de
 * comando do emulador) grava e lê num namespace isolado que o app nunca
 * enxerga, mesmo dentro do mesmo processo de emulador.
 *
 * @returns {{apiKey: string, projectId: string}}
 */
export function lerConfigDoApp() {
  const texto = readFileSync('.env.local', 'utf8');
  const mapa = {};
  for (const linha of texto.split(/\r?\n/)) {
    const encontrado = linha.match(/^(VITE_FIREBASE_[A-Z_]+)=(.*)$/);
    if (encontrado) mapa[encontrado[1]] = encontrado[2].trim();
  }

  const apiKey = mapa.VITE_FIREBASE_API_KEY;
  const projectId = mapa.VITE_FIREBASE_PROJECT_ID;
  if (!apiKey || !projectId) {
    throw new Error(
      '.env.local sem VITE_FIREBASE_API_KEY/VITE_FIREBASE_PROJECT_ID — necessário para os testes E2E (ver docs/teste-e2e.md).',
    );
  }
  return { apiKey, projectId };
}
