// Copyright (c) 2026 Daniel Felix Ferber

// Teste de fumaça da infraestrutura E2E (ADR 0010, Tarefa 0024-0003): prova
// que login instantâneo (e-mail/senha, sem popup) e fixture no Firestore
// Emulator funcionam de ponta a ponta — login → grava um estado conhecido →
// o placar exibido é esse estado, não a coleção vazia do primeiro acesso.
// Testes de regressão específicos (ex.: a faixa de bandeiras) e o teste do
// fluxo de login via popup ficam para pedidos futuros (ADR 0010 § Escopo).

import { expect, test } from '@playwright/test';
import { gravarFixture } from './helpers/fixture.js';
import { loginComEmailSenha } from './helpers/login.js';

// Seção "Extras FIFA" (sigla FWC): códigos reais FWC00–FWC19, 20 ao todo
// (src/data/catalogo.js). Todos com contagem 1: coladas = 20,
// faltantes = 994 − 20 = 974, percentual = round(20 / 994 × 100) = 2%.
const CONTAGENS_CONHECIDAS = Object.fromEntries(
  Array.from({ length: 20 }, (_, indice) => [`FWC${String(indice).padStart(2, '0')}`, 1]),
);

test('placar exibido corresponde ao estado gravado na fixture', async ({ page, baseURL }) => {
  await page.goto(baseURL);

  const { uid } = await loginComEmailSenha(page);
  await gravarFixture(uid, CONTAGENS_CONHECIDAS);

  await page.reload();

  const titulo = page.locator('.cabecalho__titulo');
  await expect(titulo).toContainText('20/994');
  await expect(titulo).toContainText('2%');
  await expect(titulo).toContainText('974');
});
