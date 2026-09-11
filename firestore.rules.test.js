// Copyright (c) 2026 Daniel Felix Ferber

// Prova executável de que um usuário não acessa os dados de outro e de
// que o schema do documento é o aceito pelas regras.
//
// Esta é a garantia real de isolamento (ver ADR 0007 e TDR 0008) e de
// validação do formato (ver ADR 0008 e TDR 0009): o bundle do app é
// público e qualquer requisição pode ser forjada, então nenhum teste do
// lado do cliente prova coisa alguma sobre autorização ou formato — só a
// avaliação de firestore.rules no servidor prova. Aqui as regras rodam
// no emulador, que é o mesmo motor de avaliação da produção.
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
  deleteField,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
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
async function semearDocumentoDoDono(dados = { contagens: { BRA05: 3 } }) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "users", DONO), dados);
  });
}

// Documento da era do botão, para os casos de migração do `teamName`.
async function semearDocumentoComTeamName() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "users", DONO), {
      teamName: "Brazil",
    });
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

// Mapa esparso com `n` chaves e valores válidos, para os casos de limite
// de tamanho. As chaves são arbitrárias: sem a allow-list (que não coube
// — Tarefa 0005-0002), as chaves só se limitam em quantidade.
function montaMapa(n) {
  const mapa = {};
  for (let i = 1; i <= n; i += 1) {
    mapa[`K${String(i).padStart(4, "0")}`] = 1;
  }
  return mapa;
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
      setDoc(doc(comoIntruso(), "users", DONO), {
        contagens: { BRA05: 3 },
        updatedAt: serverTimestamp(),
      }),
    );
  });

  it("nega a gravação a quem não está autenticado", async () => {
    await assertFails(
      setDoc(doc(comoAnonimo(), "users", DONO), {
        contagens: { BRA05: 3 },
        updatedAt: serverTimestamp(),
      }),
    );
  });

  it("nega listar a coleção de usuários, mesmo autenticado", async () => {
    await semearDocumentoDoDono();

    // `allow get` em vez de `allow read` existe exatamente para isto:
    // sem query, ninguém varre a coleção atrás dos documentos alheios.
    await assertFails(getDocs(collection(comoDono(), "users")));
    await assertFails(getDocs(collection(comoIntruso(), "users")));
  });

  it("nega apagar o próprio documento", async () => {
    await semearDocumentoDoDono();

    await assertFails(deleteDoc(doc(comoDono(), "users", DONO)));
  });
});

describe("firestore.rules — validação de valores nas contagens", () => {
  it("aceita os extremos 1 e 99", async () => {
    await assertSucceeds(
      setDoc(doc(comoDono(), "users", DONO), {
        contagens: { BRA05: 1, FWC12: 99 },
        updatedAt: serverTimestamp(),
      }),
    );
  });

  it("nega valor 0", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), {
        contagens: { BRA05: 0 },
        updatedAt: serverTimestamp(),
      }),
    );
  });

  it("nega valor negativo", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), {
        contagens: { BRA05: -1 },
        updatedAt: serverTimestamp(),
      }),
    );
  });

  it("nega valor 100", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), {
        contagens: { BRA05: 100 },
        updatedAt: serverTimestamp(),
      }),
    );
  });

  it("nega valor não-inteiro", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), {
        contagens: { BRA05: 1.5 },
        updatedAt: serverTimestamp(),
      }),
    );
  });

  it("nega valor string", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), {
        contagens: { BRA05: "3" },
        updatedAt: serverTimestamp(),
      }),
    );
  });
});

describe("firestore.rules — validação de campos e timestamps", () => {
  it("nega campo extra além dos três", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), {
        contagens: { BRA05: 3 },
        updatedAt: serverTimestamp(),
        extra: true,
      }),
    );
  });

  it("nega updatedAt forjado (diferente de request.time)", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), {
        contagens: { BRA05: 3 },
        updatedAt: Timestamp.fromMillis(0),
      }),
    );
  });

  it("nega contagens sem updatedAt", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), {
        contagens: { BRA05: 3 },
      }),
    );
  });

  it("aceita documento só com atestadoEm, sem contagens", async () => {
    await assertSucceeds(
      setDoc(doc(comoDono(), "users", DONO), {
        atestadoEm: serverTimestamp(),
      }),
    );
  });
});

describe("firestore.rules — migração do teamName", () => {
  it("aceita o update que apaga o teamName junto da primeira gravação", async () => {
    await semearDocumentoComTeamName();

    await assertSucceeds(
      updateDoc(doc(comoDono(), "users", DONO), {
        contagens: { BRA05: 3 },
        updatedAt: serverTimestamp(),
        teamName: deleteField(),
      }),
    );
  });

  it("nega o update que mantém o teamName junto de contagens", async () => {
    await semearDocumentoComTeamName();

    await assertFails(
      updateDoc(doc(comoDono(), "users", DONO), {
        contagens: { BRA05: 3 },
        updatedAt: serverTimestamp(),
      }),
    );
  });
});

describe("firestore.rules — limite do mapa", () => {
  it("aceita 994 chaves", async () => {
    await assertSucceeds(
      setDoc(doc(comoDono(), "users", DONO), {
        contagens: montaMapa(994),
        updatedAt: serverTimestamp(),
      }),
    );
  });

  it("nega 995 chaves", async () => {
    await assertFails(
      setDoc(doc(comoDono(), "users", DONO), {
        contagens: montaMapa(995),
        updatedAt: serverTimestamp(),
      }),
    );
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
