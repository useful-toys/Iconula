// Copyright (c) 2026 Daniel Felix Ferber

// Prova executável de que um usuário não acessa os dados de outro.
//
// Esta é a garantia real de isolamento (ver ADR 0007 e TDR 0008): o
// bundle do app é público e qualquer requisição pode ser forjada, então
// nenhum teste do lado do cliente prova coisa alguma sobre autorização —
// só a avaliação de firestore.rules no servidor prova. Aqui as regras
// rodam no emulador, que é o mesmo motor de avaliação da produção.
//
// Roda no CI a cada PR (`npm run test:rules`): uma regressão em
// firestore.rules quebra o build.

import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { afterAll, afterEach, beforeAll, describe, it } from "vitest";

// O prefixo `demo-` faz o emulador rodar totalmente offline, sem
// credencial nenhuma — é o que permite estes testes rodarem no ci.yml,
// que também vale para PR de fork.
const PROJECT_ID = "demo-iconula";

const DONO = "uid-do-dono";
const INTRUSO = "uid-do-intruso";

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

// Cria o documento do dono ignorando as regras, para os casos que
// precisam de um documento preexistente.
async function semearDocumentoDoDono(teamName = "Brazil") {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "users", DONO), { teamName });
  });
}

function comoDono() {
  return testEnv.authenticatedContext(DONO).firestore();
}

function comoIntruso() {
  return testEnv.authenticatedContext(INTRUSO).firestore();
}

function comoAnonimo() {
  return testEnv.unauthenticatedContext().firestore();
}

describe("firestore.rules — isolamento entre usuários", () => {
  it("o dono lê o próprio documento", async () => {
    await semearDocumentoDoDono();

    await assertSucceeds(getDoc(doc(comoDono(), "users", DONO)));
  });

  it("nega a leitura do documento de outro usuário", async () => {
    await semearDocumentoDoDono();

    await assertFails(getDoc(doc(comoIntruso(), "users", DONO)));
  });

  it("nega a leitura a quem não está autenticado", async () => {
    await semearDocumentoDoDono();

    await assertFails(getDoc(doc(comoAnonimo(), "users", DONO)));
  });

  it("nega a gravação no documento de outro usuário", async () => {
    await assertFails(
      setDoc(doc(comoIntruso(), "users", DONO), { teamName: "Brazil" }),
    );
  });

  it("nega a gravação a quem não está autenticado", async () => {
    await assertFails(
      setDoc(doc(comoAnonimo(), "users", DONO), { teamName: "Brazil" }),
    );
  });

  it("nega listar a coleção de usuários, mesmo autenticado", async () => {
    await semearDocumentoDoDono();

    // `allow get` em vez de `allow read` existe exatamente para isto:
    // sem query, ninguém varre a coleção atrás dos documentos alheios.
    await assertFails(getDocs(collection(comoDono(), "users")));
    await assertFails(getDocs(collection(comoIntruso(), "users")));
  });
});

describe("firestore.rules — validação de formato na escrita", () => {
  it("o dono grava o próprio time", async () => {
    await assertSucceeds(
      setDoc(doc(comoDono(), "users", DONO), { teamName: "Brazil" }),
    );
  });

  it("o dono atualiza o próprio time", async () => {
    await semearDocumentoDoDono("Brazil");

    await assertSucceeds(
      setDoc(
        doc(comoDono(), "users", DONO),
        { teamName: "Argentina" },
        { merge: true },
      ),
    );
  });

  it("nega campo extra além de teamName", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), {
        teamName: "Brazil",
        admin: true,
      }),
    );
  });

  it("nega teamName que não seja string", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), { teamName: 42 }),
    );
  });

  it("nega teamName vazio", async () => {
    await assertFails(setDoc(doc(comoDono(), "users", DONO), { teamName: "" }));
  });

  it("nega teamName acima de 64 caracteres", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), { teamName: "x".repeat(65) }),
    );
  });

  it("nega apagar o próprio documento", async () => {
    await semearDocumentoDoDono();

    await assertFails(deleteDoc(doc(comoDono(), "users", DONO)));
  });
});

describe("firestore.rules — caminhos não previstos", () => {
  it("nega leitura e escrita fora de users/{uid}", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "outraColecao", "qualquer"), { x: 1 }),
    );
    await assertFails(getDoc(doc(comoDono(), "outraColecao", "qualquer")));
  });

  it("nega escrita em subcoleção do próprio documento", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO, "segredos", "x"), { x: 1 }),
    );
  });
});
