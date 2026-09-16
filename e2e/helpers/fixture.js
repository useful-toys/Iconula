// Copyright (c) 2026 Daniel Felix Ferber

import { readFileSync } from 'node:fs';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc } from 'firebase/firestore';
import { lerConfigDoApp } from './env.js';

/**
 * Grava `users/{uid}` no Firestore Emulator com contagens conhecidas,
 * antes de abrir a página — para cenários além da coleção vazia
 * (ADR 0010, MDR 0002).
 *
 * Sempre grava `atestadoEm` junto: sem isso a conta cairia na tela de
 * atestação de menores (`Atestacao.jsx`) em vez do catálogo, que não é o
 * que esta fixture prepara — os testes que precisam da tela de atestação
 * usam `loginComPopupFake` (`login.js`) num usuário novo, sem fixture.
 *
 * Usa `@firebase/rules-unit-testing` — já devDependency do projeto, o
 * mesmo de `firestore.rules.test.js` (`npm run test:rules`) — com as
 * regras de segurança desligadas (`withSecurityRulesDisabled`): esta
 * fixture não testa as regras, só popula dados; testar as regras em si
 * continua sendo `npm run test:rules`.
 *
 * @param {string} uid
 * @param {Record<string, number>} contagens
 * @returns {Promise<void>}
 */
export async function gravarFixture(uid, contagens) {
  const { projectId } = lerConfigDoApp();
  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });

  try {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'users', uid), {
        contagens,
        updatedAt: new Date(),
        atestadoEm: new Date(),
      });
    });
  } finally {
    await testEnv.cleanup();
  }
}
