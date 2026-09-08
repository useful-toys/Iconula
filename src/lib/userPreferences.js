// Copyright (c) 2026 Daniel Felix Ferber

// Leitura e gravação das preferências do usuário autenticado no Cloud
// Firestore — hoje, só o time visível. Ver ADR 0007.
//
// Duas regras governam este módulo:
//
// 1. **Nada aqui lança.** Persistência é feature adicional; uma falha
//    (offline, regra negada, cota estourada, config ausente, chunk que
//    não carregou) vira log e nunca altera o que está na tela.
//
// 2. **O SDK do Firestore é carregado sob demanda.** O `import()`
//    dinâmico abaixo mantém ~430 KB fora do bundle principal: quem chega
//    deslogado — a maioria dos visitantes — nunca baixa o Firestore,
//    porque quem nunca grava nada não precisa dele.

import { app } from "./firebase";

const COLLECTION = "users";

// Memoiza o carregamento: o chunk é baixado e a instância do Firestore
// criada uma única vez, por mais cliques que o usuário dê.
let firestorePromise = null;

function carregarFirestore() {
  if (!firestorePromise) {
    firestorePromise = import("firebase/firestore").then((sdk) => ({
      sdk,
      // Banco `(default)`, a partir da mesma instância de FirebaseApp já
      // usada pelo Auth.
      db: sdk.getFirestore(app),
    }));
  }
  return firestorePromise;
}

// Documento por usuário, com o uid no caminho: é o que torna a regra de
// segurança uma comparação direta com `request.auth.uid`, sem consulta e
// sem índice (ver firestore.rules).
function userDoc(sdk, db, uid) {
  return sdk.doc(db, COLLECTION, uid);
}

/**
 * Lê o time salvo do usuário.
 *
 * O resultado é discriminado em vez de "string ou null" porque quem chama
 * precisa distinguir "ainda não existe documento" (primeiro login — fluxo
 * normal, não é defeito) de "a leitura falhou" (offline, regra negada,
 * cota). Os dois casos mantêm a bandeira que está na tela, mas só o
 * segundo vai para o console.
 *
 * @returns {Promise<{status: "found", teamName: string}
 *                 | {status: "empty"}
 *                 | {status: "error"}
 *                 | {status: "unavailable"}>}
 */
export async function loadCurrentTeam(uid) {
  if (!app || !uid) return { status: "unavailable" };

  try {
    const { sdk, db } = await carregarFirestore();
    const snapshot = await sdk.getDoc(userDoc(sdk, db, uid));
    if (!snapshot.exists()) return { status: "empty" };

    const { teamName } = snapshot.data();
    // Documento existe, mas com conteúdo inesperado (escrito por uma
    // versão futura, ou corrompido): tratar como ausente é melhor que
    // propagar um valor inválido para o estado do React.
    if (typeof teamName !== "string" || teamName === "") {
      return { status: "empty" };
    }

    return { status: "found", teamName };
  } catch (cause) {
    // Sem uid nem dados do usuário na mensagem.
    console.error("Não foi possível ler o time salvo do usuário", cause);
    return { status: "error" };
  }
}

/**
 * Grava o time visível do usuário.
 *
 * Fire-and-forget por decisão de produto (grava a cada clique, sem
 * debounce — ver ADR 0007). A Promise devolvida **sempre resolve**, nunca
 * rejeita: assim quem chama pode ignorá-la sem gerar unhandled rejection,
 * e os testes ainda conseguem aguardá-la.
 *
 * @returns {Promise<void>}
 */
export function saveCurrentTeam(uid, teamName) {
  if (!app || !uid) return Promise.resolve();

  return carregarFirestore()
    .then(({ sdk, db }) =>
      // `merge`: hoje o documento só tem `teamName`, mas o merge evita que
      // um clique apague campos que uma preferência futura tenha escrito.
      sdk.setDoc(userDoc(sdk, db, uid), { teamName }, { merge: true }),
    )
    .catch((cause) => {
      console.error("Não foi possível salvar o time do usuário", cause);
    });
}
