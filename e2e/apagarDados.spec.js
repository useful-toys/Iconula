// Copyright (c) 2026 Daniel Felix Ferber

// Apagar meus dados (IDR 0060, TDR 0027, Tarefa 0031-0003): contra os
// emuladores Auth+Firestore (ADR 0010), prova o fluxo inteiro — login pelo
// popup fake do Google, atestação de menores, uma figurinha registrada, a
// exclusão pelo painel de dois passos da política e a coleção vazia na
// entrada seguinte. O documento do dono não sobrevive: o spec confere
// `users/{uid}` direto no Firestore Emulator, além da tela.
//
// O login inicial usa `loginComPopupFake` (e não `loginComEmailSenha`) de
// propósito: a reautenticação da exclusão é um popup do Google, então a
// conta precisa ter sido criada pelo mesmo provedor. Já a reentrada depois
// da exclusão usa `loginComEmailSenha` com o mesmo e-mail: o fake do Google
// no emulador guarda a conta apagada e não oferece mais "Add new account"
// (`Internal state invariant broken`), e o que o teste precisa provar nessa
// altura é que a coleção volta vazia.

import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc } from 'firebase/firestore';
import { loginComEmailSenha, loginComPopupFake } from './helpers/login.js';
import { lerConfigDoApp } from './helpers/env.js';

const EMAIL = 'apaga@iconula.test';
const NOME = 'Apaga Dados';

// Preenche a UI fake do Google que o emulador abre numa popup — serve ao
// login e à reautenticação, que é a mesma conta no mesmo provedor.
async function preencherPopupGoogle(popup) {
  await popup.waitForLoadState('domcontentloaded');
  await popup.getByText('Add new account').click();
  await popup.locator('#email-input').fill(EMAIL);
  await popup.locator('#display-name-input').fill(NOME);
  await popup.getByText('Sign in with Google.com', { exact: true }).click();
}

// Lê o uid da sessão que o app persistiu no IndexedDB — o mesmo formato que
// `loginComEmailSenha` grava e `firebase/auth` usa.
async function uidDaSessao(page, apiKey) {
  return page.evaluate(
    (chave) =>
      new Promise((resolve, reject) => {
        const requisicao = indexedDB.open('firebaseLocalStorageDb', 1);
        requisicao.onsuccess = () => {
          const db = requisicao.result;
          const transacao = db.transaction('firebaseLocalStorage', 'readonly');
          const leitura = transacao.objectStore('firebaseLocalStorage').get(chave);
          leitura.onsuccess = () => {
            db.close();
            resolve(leitura.result?.value?.uid ?? null);
          };
          leitura.onerror = () => reject(leitura.error);
        };
        requisicao.onerror = () => reject(requisicao.error);
      }),
    `firebase:authUser:${apiKey}:[DEFAULT]`,
  );
}

// Confere `users/{uid}` direto no Firestore Emulator, com as regras
// desligadas — o mesmo mecanismo de `e2e/helpers/fixture.js`.
async function documentoExiste(projectId, uid) {
  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
  try {
    let existe;
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const snapshot = await getDoc(doc(context.firestore(), 'users', uid));
      existe = snapshot.exists();
    });
    return existe;
  } finally {
    await testEnv.cleanup();
  }
}

test('apagar meus dados remove a coleção e a conta; o login seguinte vem vazio', async ({
  page,
}) => {
  const { apiKey, projectId } = lerConfigDoApp();

  await page.goto('/');

  // Primeiro acesso: login pelo popup fake do Google e atestação de menores.
  await loginComPopupFake(page, { email: EMAIL, displayName: NOME });
  await page.getByRole('button', { name: 'Confirmar' }).click();

  const uid = await uidDaSessao(page, apiKey);
  expect(uid).toBeTruthy();
  expect(await documentoExiste(projectId, uid)).toBe(true);

  // Registra uma figurinha: o placar sai de 0/994 para 1/994.
  await expect(page.locator('.cabecalho__titulo')).toContainText('0/994');
  await page.locator('.figurinha__corpo').first().click();
  await expect(page.locator('.cabecalho__titulo')).toContainText('1/994');

  // Abre a política pelo rodapé e percorre o painel de dois passos.
  await page.getByRole('button', { name: 'Política de privacidade' }).click();
  await page.getByRole('button', { name: 'Apagar meus dados' }).click();

  // A reautenticação abre de novo a popup do Google.
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Apagar definitivamente' }).click(),
  ]);
  await preencherPopupGoogle(popup);

  // A tela final sobrevive ao fim da sessão, que o `deleteUser` provoca.
  await expect(page.getByText('Seus dados foram apagados')).toBeVisible();

  // O documento do dono sumiu do Firestore, não só da tela.
  expect(await documentoExiste(projectId, uid)).toBe(false);

  // Volta à tela de login e entra de novo: a coleção vem vazia.
  await page.getByRole('button', { name: 'Voltar à tela de login' }).click();
  await loginComEmailSenha(page, { email: EMAIL });
  await page.reload();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.locator('.cabecalho__titulo')).toContainText('0/994');
});
