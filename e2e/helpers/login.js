// Copyright (c) 2026 Daniel Felix Ferber

// Login duplo contra o Firebase Auth Emulator (ADR 0010): um helper dirige
// a UI fake do Google que o emulador abre numa popup — para os testes que
// validam o próprio fluxo de login —; o outro autentica um usuário fixo
// por e-mail/senha direto pelo SDK, sem popup, para todo o resto.

import { deleteApp, initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { lerConfigDoApp } from './env.js';

const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';

/**
 * Dirige a UI fake do Google que o Auth Emulator abre numa popup, para os
 * testes que validam o próprio fluxo de login (clique em "Entrar com
 * Google", atestação de menores no primeiro acesso) — o mesmo
 * `LoginButton.jsx`/`signInWithPopup` de produção, sem mudança de código
 * (ADR 0010). Assume que a página já está na tela de login (sem sessão).
 *
 * @param {import('@playwright/test').Page} page
 * @param {{email?: string, displayName?: string}} [opcoes]
 * @returns {Promise<void>}
 */
export async function loginComPopupFake(page, opcoes = {}) {
  const { email = `popup-${Date.now()}@iconula.test`, displayName = 'Teste E2E (popup)' } = opcoes;

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByText('Entrar com Google').click(),
  ]);

  await popup.waitForLoadState('domcontentloaded');
  await popup.getByText('Add new account').click();
  await popup.locator('#email-input').fill(email);
  await popup.locator('#display-name-input').fill(displayName);
  await popup.getByText('Sign in with Google.com', { exact: true }).click();
}

/**
 * Autentica um usuário fixo por e-mail/senha direto contra o Auth
 * Emulator, sem popup (ADR 0010) — mais rápido e sem a instabilidade de
 * repetir uma segunda janela em cada teste. Cria a conta na primeira
 * chamada; reaproveita nas seguintes.
 *
 * Roda inteiramente do lado do Playwright (Node), com uma instância do
 * SDK própria deste helper (não a do bundle do app): autentica contra o
 * emulador e grava a sessão resultante no IndexedDB do navegador, no
 * mesmo formato que `firebase/auth` usa para persistir `currentUser`
 * (banco `firebaseLocalStorageDb`, chave
 * `firebase:authUser:<apiKey>:[DEFAULT]`). Ao recarregar, `App.jsx`
 * encontra a sessão já pronta no primeiro `onAuthStateChanged` — como um
 * login real restaurado —, sem precisar de nenhum código de teste em
 * `src/` (a alternativa de "modo de teste" dentro de `App.jsx` foi
 * rejeitada na ADR 0010, alternativas consideradas).
 *
 * Pré-condição: `page` já deve estar navegada para a origem do app — o
 * IndexedDB é isolado por origem. Recarregue a página depois desta
 * chamada (`page.reload()` ou novo `page.goto()`) para que a sessão
 * semeada valha.
 *
 * @param {import('@playwright/test').Page} page - já navegada para o app.
 * @param {{email?: string, password?: string, displayName?: string}} [opcoes]
 * @returns {Promise<{uid: string}>}
 */
export async function loginComEmailSenha(page, opcoes = {}) {
  const {
    email = 'e2e@iconula.test',
    password = 'senha-e2e-123',
    displayName = 'Teste E2E',
  } = opcoes;

  const { apiKey, projectId } = lerConfigDoApp();
  const app = initializeApp({ apiKey, projectId }, `e2e-login-${Date.now()}`);
  const auth = getAuth(app);
  connectAuthEmulator(auth, AUTH_EMULATOR_URL, { disableWarnings: true });

  let credencial;
  try {
    credencial = await signInWithEmailAndPassword(auth, email, password);
  } catch (erro) {
    if (erro.code !== 'auth/invalid-credential' && erro.code !== 'auth/user-not-found') throw erro;
    credencial = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credencial.user, { displayName });
  }

  const usuario = credencial.user.toJSON();
  await deleteApp(app);

  const chaveDeSessao = `firebase:authUser:${apiKey}:[DEFAULT]`;
  await page.evaluate(
    ({ chave, valor }) =>
      new Promise((resolve, reject) => {
        const requisicao = indexedDB.open('firebaseLocalStorageDb', 1);
        requisicao.onupgradeneeded = () => {
          requisicao.result.createObjectStore('firebaseLocalStorage', { keyPath: 'fbase_key' });
        };
        requisicao.onsuccess = () => {
          const db = requisicao.result;
          const transacao = db.transaction('firebaseLocalStorage', 'readwrite');
          transacao.objectStore('firebaseLocalStorage').put({ fbase_key: chave, value: valor });
          transacao.oncomplete = () => {
            db.close();
            resolve();
          };
          transacao.onerror = () => reject(transacao.error);
        };
        requisicao.onerror = () => reject(requisicao.error);
      }),
    { chave: chaveDeSessao, valor: usuario },
  );

  return { uid: usuario.uid };
}
