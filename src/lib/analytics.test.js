// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  carregarAnalytics,
  consentimentoAnalytics,
  gravarConsentimentoAnalytics,
  iniciarAnalyticsSeConsentido,
} from './analytics.js';

const CHAVE = 'iconula.consentimento-analytics.v1';
const ID = 'G-TESTE123';
const URL_SCRIPT = `https://www.googletagmanager.com/gtag/js?id=${ID}`;

// O host de jsdom é sempre `localhost`, e `window.location` não é
// reconfigurável; os casos de hostname de canal trocam o global `location`
// com `vi.stubGlobal`, restaurado no `afterEach`.
function scriptsDeGtag() {
  return document.querySelectorAll('script[src^="https://www.googletagmanager.com/gtag/js"]');
}

function limparScripts() {
  scriptsDeGtag().forEach((script) => script.remove());
}

beforeEach(() => {
  localStorage.clear();
  limparScripts();
  delete window.dataLayer;
  delete window.gtag;
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  limparScripts();
  delete window.dataLayer;
  delete window.gtag;
});

describe('consentimentoAnalytics', () => {
  it('sem valor guardado, retorna nao-decidido', () => {
    expect(consentimentoAnalytics()).toBe('nao-decidido');
  });

  it('valor desconhecido, retorna nao-decidido', () => {
    localStorage.setItem(CHAVE, 'talvez');

    expect(consentimentoAnalytics()).toBe('nao-decidido');
  });

  it('falha de leitura, retorna nao-decidido', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage bloqueado');
    });

    expect(consentimentoAnalytics()).toBe('nao-decidido');
  });
});

describe('gravarConsentimentoAnalytics', () => {
  it('grava aceito e lê de volta', () => {
    gravarConsentimentoAnalytics('aceito');

    expect(localStorage.getItem(CHAVE)).toBe('aceito');
    expect(consentimentoAnalytics()).toBe('aceito');
  });

  it('grava recusado e lê de volta', () => {
    gravarConsentimentoAnalytics('recusado');

    expect(localStorage.getItem(CHAVE)).toBe('recusado');
    expect(consentimentoAnalytics()).toBe('recusado');
  });

  it('valor fora do domínio não é gravado', () => {
    gravarConsentimentoAnalytics('talvez');

    expect(localStorage.getItem(CHAVE)).toBeNull();
    expect(consentimentoAnalytics()).toBe('nao-decidido');
  });

  it('falha de escrita não quebra', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage bloqueado');
    });

    expect(() => gravarConsentimentoAnalytics('aceito')).not.toThrow();
  });
});

describe('carregarAnalytics', () => {
  it('injeta o script do gtag e chama config com o Measurement ID', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', ID);

    carregarAnalytics();

    const scripts = scriptsDeGtag();
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toBe(URL_SCRIPT);
    expect(scripts[0].async).toBe(true);
    expect(window.dataLayer.map((args) => Array.from(args))).toEqual([
      ['js', expect.any(Date)],
      ['config', ID],
    ]);
  });

  it('é idempotente — não injeta o script duas vezes', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', ID);

    carregarAnalytics();
    carregarAnalytics();

    expect(scriptsDeGtag()).toHaveLength(1);
    expect(window.dataLayer).toHaveLength(2);
  });

  it('sem VITE_GA_MEASUREMENT_ID não carrega', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');

    carregarAnalytics();

    expect(scriptsDeGtag()).toHaveLength(0);
    expect(window.dataLayer).toBeUndefined();
  });

  it('hostname de canal de preview não carrega', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', ID);
    vi.stubGlobal('location', { hostname: 'iconula--pr12-abc123.web.app' });

    carregarAnalytics();

    expect(scriptsDeGtag()).toHaveLength(0);
  });

  it('localhost sem a variável não carrega', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');

    carregarAnalytics();

    expect(scriptsDeGtag()).toHaveLength(0);
  });
});

describe('iniciarAnalyticsSeConsentido', () => {
  it("com 'aceito' carrega o gtag", () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', ID);
    localStorage.setItem(CHAVE, 'aceito');

    iniciarAnalyticsSeConsentido();

    expect(scriptsDeGtag()).toHaveLength(1);
  });

  it("com 'recusado' não carrega", () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', ID);
    localStorage.setItem(CHAVE, 'recusado');

    iniciarAnalyticsSeConsentido();

    expect(scriptsDeGtag()).toHaveLength(0);
  });

  it('sem decisão não carrega', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', ID);

    iniciarAnalyticsSeConsentido();

    expect(scriptsDeGtag()).toHaveLength(0);
  });

  it("com 'aceito' em canal de preview não carrega", () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', ID);
    localStorage.setItem(CHAVE, 'aceito');
    vi.stubGlobal('location', { hostname: 'iconula--pr3-deadbeef.web.app' });

    iniciarAnalyticsSeConsentido();

    expect(scriptsDeGtag()).toHaveLength(0);
  });
});
