// Copyright (c) 2026 Daniel Felix Ferber

// Vista do catálogo compartilhado por link (IDR 0055, Tarefa 0027-0006):
// contra os emuladores Auth+Firestore (ADR 0010), prova que `/catalogo/<uid>`
// abre sem login o catálogo do dono quando o link está ligado — em somente
// leitura, com cartões inertes — e mostra a tela de não compartilhado quando
// o link está desligado. A fixture grava o estado conhecido antes do `goto`;
// nenhum helper de login entra aqui (IDR 0055: a vista não usa a sessão).

import { expect, test } from '@playwright/test';
import { gravarFixture } from './helpers/fixture.js';

// Seção "Extras FIFA" (sigla FWC), os mesmos 20 códigos do teste de fumaça
// (`catalogo.spec.js`): coladas = 20, faltantes = 994 − 20 = 974,
// percentual = round(20 / 994 × 100) = 2%.
const CONTAGENS_CONHECIDAS = Object.fromEntries(
  Array.from({ length: 20 }, (_, indice) => [`FWC${String(indice).padStart(2, '0')}`, 1]),
);

const UID_LIGADO = 'dono-link-ligado';
const UID_DESLIGADO = 'dono-link-desligado';

test('link ligado abre o catálogo do dono sem login, em somente leitura', async ({
  page,
  baseURL,
}) => {
  await gravarFixture(UID_LIGADO, CONTAGENS_CONHECIDAS, { linkAtivo: true });

  await page.goto(`${baseURL}/catalogo/${UID_LIGADO}`);

  const titulo = page.locator('.cabecalho__titulo');
  await expect(titulo).toContainText('20/994');
  await expect(titulo).toContainText('2%');
  await expect(titulo).toContainText('974');
  await expect(titulo).toContainText('somente leitura');

  // Cartões inertes (IDR 0055): tocar num deles não muda o placar.
  await page.locator('.figurinha__corpo--leitura').first().click();
  await expect(titulo).toContainText('20/994');
  await expect(titulo).toContainText('974');
});

test('link desligado mostra a tela de não compartilhado', async ({ page, baseURL }) => {
  await gravarFixture(UID_DESLIGADO, CONTAGENS_CONHECIDAS, { linkAtivo: false });

  await page.goto(`${baseURL}/catalogo/${UID_DESLIGADO}`);

  await expect(page.getByText('Este catálogo não está compartilhado.')).toBeVisible();
  await expect(page.locator('.cabecalho__titulo')).toHaveCount(0);
});
