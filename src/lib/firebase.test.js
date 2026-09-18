// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// `firebase.js` decide na carga do módulo se há config (`isConfigured`) e
// guarda `app`/`auth` em variáveis do módulo. Testar os dois estados exige
// mockar os SDKs e recarregar o módulo com `vi.resetModules()` a cada caso,
// com as `VITE_FIREBASE_*` fixadas por `vi.stubEnv` — sem isso, o resultado
// dependeria de `.env.local` existir na máquina (presente em dev, ausente
// no CI).
const app = vi.hoisted(() => ({ initializeApp: vi.fn() }));

// Contrato dos mocks: com a instância nula, o SDK real lança
// (`auth/invalid-api-key` ou TypeError ao ler `auth.currentUser`). As
// implementações imitam isso para que o caso "sem Firebase configurado"
// seja exercitado de verdade, e não apenas atestado por leitura.
const auth = vi.hoisted(() => ({
  connectAuthEmulator: vi.fn(),
  deleteUser: vi.fn(),
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  reauthenticateWithPopup: vi.fn(),
  signInWithPopup: vi.fn(),
}));

vi.mock('firebase/app', () => ({ initializeApp: app.initializeApp }));

vi.mock('firebase/auth', () => ({
  connectAuthEmulator: auth.connectAuthEmulator,
  deleteUser: auth.deleteUser,
  getAuth: auth.getAuth,
  GoogleAuthProvider: auth.GoogleAuthProvider,
  reauthenticateWithPopup: auth.reauthenticateWithPopup,
  signInWithPopup: auth.signInWithPopup,
}));

const CONFIG = {
  VITE_FIREBASE_API_KEY: 'chave-de-teste',
  VITE_FIREBASE_AUTH_DOMAIN: 'iconula.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'iconula',
  VITE_FIREBASE_STORAGE_BUCKET: 'iconula.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '1',
  VITE_FIREBASE_APP_ID: '1:1:web:1',
};

const SEM_ERRO_DE_CONFIG = () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
};

async function carregarModulo(configurado) {
  for (const [chave, valor] of Object.entries(CONFIG)) {
    vi.stubEnv(chave, configurado ? valor : '');
  }
  return import('./firebase.js');
}

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();

  app.initializeApp.mockReset();
  app.initializeApp.mockReturnValue({ name: 'iconula' });
  auth.connectAuthEmulator.mockReset();
  auth.deleteUser.mockReset();
  auth.deleteUser.mockImplementation((usuario) => {
    if (!usuario) throw new Error('auth/invalid-api-key');
    return Promise.resolve();
  });
  auth.getAuth.mockReset();
  auth.getAuth.mockReturnValue({ currentUser: { uid: 'u1' } });
  auth.GoogleAuthProvider.mockReset();
  auth.GoogleAuthProvider.mockImplementation(function GoogleAuthProviderFalso() {});
  auth.reauthenticateWithPopup.mockReset();
  auth.reauthenticateWithPopup.mockImplementation((instancia) => {
    if (!instancia) throw new Error('auth/invalid-api-key');
    return Promise.resolve({ user: { uid: 'u1' } });
  });
  auth.signInWithPopup.mockReset();
  auth.signInWithPopup.mockResolvedValue({ user: { uid: 'u1' } });

  SEM_ERRO_DE_CONFIG();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('com Firebase configurado (Tarefa 0031-0002)', () => {
  let modulo;

  beforeEach(async () => {
    modulo = await carregarModulo(true);
  });

  it('inicializa app e auth a partir das VITE_FIREBASE_*', () => {
    expect(app.initializeApp).toHaveBeenCalledTimes(1);
    expect(auth.getAuth).toHaveBeenCalledWith(modulo.app);
    expect(modulo.app).not.toBeNull();
    expect(modulo.auth).not.toBeNull();
  });

  describe('reauthenticateWithGoogle', () => {
    it('reautentica o usuário corrente por popup do Google', async () => {
      const resultado = await modulo.reauthenticateWithGoogle();

      expect(auth.reauthenticateWithPopup).toHaveBeenCalledTimes(1);
      const [instancia, provedor] = auth.reauthenticateWithPopup.mock.calls[0];
      expect(instancia).toBe(modulo.auth);
      expect(provedor).toBeInstanceOf(auth.GoogleAuthProvider);
      expect(auth.signInWithPopup).not.toHaveBeenCalled();
      expect(resultado).toEqual({ user: { uid: 'u1' } });
    });

    it('propaga o erro do SDK (popup fechado é decisão de quem chama)', async () => {
      const erro = Object.assign(new Error('popup fechado pelo usuário'), {
        code: 'auth/popup-closed-by-user',
      });
      auth.reauthenticateWithPopup.mockRejectedValueOnce(erro);

      await expect(modulo.reauthenticateWithGoogle()).rejects.toBe(erro);
    });
  });

  describe('deleteUserAccount', () => {
    it('apaga a conta do usuário corrente', async () => {
      await modulo.deleteUserAccount();

      expect(auth.deleteUser).toHaveBeenCalledTimes(1);
      expect(auth.deleteUser).toHaveBeenCalledWith(modulo.auth.currentUser);
    });

    it('propaga o erro do SDK (login recente exigido)', async () => {
      const erro = Object.assign(new Error('faça login de novo'), {
        code: 'auth/requires-recent-login',
      });
      auth.deleteUser.mockRejectedValueOnce(erro);

      await expect(modulo.deleteUserAccount()).rejects.toBe(erro);
    });
  });
});

describe('sem Firebase configurado (Tarefa 0031-0002)', () => {
  let modulo;

  beforeEach(async () => {
    modulo = await carregarModulo(false);
  });

  it('não inicializa app nem auth, e exporta ambos nulos', () => {
    expect(app.initializeApp).not.toHaveBeenCalled();
    expect(auth.getAuth).not.toHaveBeenCalled();
    expect(modulo.app).toBeNull();
    expect(modulo.auth).toBeNull();
  });

  it('reauthenticateWithGoogle falha em vez de resolver em silêncio', () => {
    // O módulo passa `auth` nulo ao SDK, que lança; a função propaga.
    expect(() => modulo.reauthenticateWithGoogle()).toThrow('auth/invalid-api-key');
    expect(auth.reauthenticateWithPopup).toHaveBeenCalledWith(null, expect.anything());
  });

  it('deleteUserAccount falha — não há usuário corrente para apagar', () => {
    expect(() => modulo.deleteUserAccount()).toThrow();
    expect(auth.deleteUser).not.toHaveBeenCalled();
  });
});
