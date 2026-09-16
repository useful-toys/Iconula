<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0027-0004]: chave do link do catálogo no popup Compartilhar

## Status
Pendente

## Objetivo
Dar ao dono o controle do link: a carga do login traz `linkAtivo`, e um
terceiro bloco no popup Compartilhar mostra a chave `Link do catálogo:
ligado/desligado`, que grava na hora, não fecha o popup e volta ao estado
anterior se a gravação falhar.

## Documentos de referência
- `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
  § Decisão — "Ligar e desligar", textos visíveis
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão — terceiro
  bloco do popup; fechamento e foco do popup
- `docs/model-dr/0002-schema-do-documento-da-colecao.md` § Decisão —
  `linkAtivo` gravado sem `updatedAt`
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão
- `docs/tdr/0019-espera-sem-rede-via-corrida-com-timeout-e-callback.md`
  § Decisão
- `docs/idr/0010-desfazer-ajustes-em-vez-de-confirmacoes.md` § Decisão
- `src/lib/colecaoRemota.js` — `carregarColecao`, `gravarAtestacao` como
  precedente de escrita de campo isolado
- `src/components/MenuDeCompartilhar.jsx` e teste; `src/App.jsx`
- `docs/interface.md` § Menu de ações › Compartilhar, § Avisos;
  `docs/modelo-firebase.md` § Operações sobre o documento

## Padrões e convenções aplicáveis
- Escrita fora da gravação agregada e sem `updatedAt`: o relógio do título
  continua significando alteração de contagens — MDR 0002, IDR 0027
- Nunca lança: resultado discriminado, como as demais escritas — ADR 0005
- A chave é a exceção ao "fecha ao escolher um item"; `Esc`, tocar fora e
  sair pelo teclado seguem fechando — IDR 0024, IDR 0055
- Nome acessível e estado por extenso (`role="switch"` com
  `aria-checked`, ou equivalente) — requisitos.md § Requisitos Não
  Funcionais, IDR 0018
- Sem confirmação para ligar ou desligar — IDR 0010, IDR 0055

## Escopo e instruções de implementação
1. `src/lib/colecaoRemota.js`:
   - `carregarColecao` devolve também `linkAtivo` (booleano; ausente →
     `false`);
   - nova função de escrita que grava só `linkAtivo` com `merge: true`,
     sem `updatedAt`, com o mesmo contrato de resultado e aviso de espera.
2. `src/App.jsx`: estado `linkAtivo` vindo da carga (conta nova →
   `false`); ao alternar, muda o estado na hora e grava; sucesso → aviso
   `Link ligado` ou `Link desligado`; falha → estado volta ao anterior e
   aviso `Falha ao ligar o link — toque para detalhes` ou `Falha ao
   desligar o link — toque para detalhes`, com o detalhe técnico; espera
   sem rede → o aviso de conexão instável vigente. Logout limpa o estado.
3. `src/components/MenuDeCompartilhar.jsx` (+ `.css`): terceiro bloco,
   separado por filete, com a chave `Link do catálogo: ligado` /
   `Link do catálogo: desligado`; tocar não fecha o popup e o foco fica na
   chave; enquanto grava, um segundo toque não dispara nova gravação.
4. Testes: `MenuDeCompartilhar.test.jsx` — chave presente, estado anunciado,
   não fecha o popup, `Esc` continua fechando; novo
   `src/App.linkDoCatalogo.test.jsx` com o módulo remoto stubado — carga
   com e sem `linkAtivo`, ligar e desligar com avisos, falha reverte e
   avisa, gravação não inclui `updatedAt` nem passa pela agregação;
   `colecaoRemota.test.js` — nova função e o campo novo da carga.
5. `docs/interface.md`, citando IDR 0024 e IDR 0055: § Menu de ações ›
   Compartilhar — terceiro bloco, textos, exceção ao fechamento, avisos;
   § Avisos — `link ligado` e `link desligado` entre os sucessos, falha ao
   ligar/desligar entre as falhas.
6. `docs/modelo-firebase.md` § Mecanismo de gravação: a quarta função de
   escrita, citando MDR 0002.
7. `AGENTS.md` § Onde fica cada coisa: linha de `MenuDeCompartilhar.jsx`
   com a chave, `colecaoRemota.js` com a nova escrita e o novo teste de
   `App`.

**Fora do escopo**: copiar e compartilhar o link (Tarefa 0027-0005);
regras (Tarefa 0027-0001); vista do link (Tarefa 0027-0003).

## Decisões já tomadas (não reabrir)
- Chave explícita no terceiro bloco, grava na hora, não fecha o popup,
  reverte em falha, sem confirmação; textos — ver
  `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
- Terceiro bloco do popup Compartilhar — ver
  `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md`
- `linkAtivo` sem `updatedAt` — ver
  `docs/model-dr/0002-schema-do-documento-da-colecao.md`

## Decisões em aberto nesta tarefa
- Desligar grava `false` ou apaga o campo (`deleteField`) — nível 1;
  ambos satisfazem as regras da Tarefa 0027-0001; registrar no log.
- Aparência da chave (glifo, trilho) dentro dos tokens existentes —
  nível 2; registrar no log.

## Arquivos impactados
- `src/lib/colecaoRemota.js`, `src/lib/colecaoRemota.test.js` — modificar
- `src/App.jsx` — modificar
- `src/App.linkDoCatalogo.test.jsx` — criar
- `src/components/MenuDeCompartilhar.jsx`,
  `src/components/MenuDeCompartilhar.test.jsx`,
  `src/components/MenuDeCompartilhar.css` — modificar
- `docs/interface.md` — modificar (§ Menu de ações › Compartilhar,
  § Avisos)
- `docs/modelo-firebase.md` — modificar (§ Mecanismo de gravação)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] O popup mostra o terceiro bloco com a chave no estado vindo da carga
      (testes com `linkAtivo` true, false e ausente)
- [ ] Alternar grava só `linkAtivo`, sem `updatedAt` e fora da gravação
      agregada, e avisa `Link ligado`/`Link desligado` (testes)
- [ ] Falha na gravação volta a chave e emite a falha com detalhe (teste)
- [ ] Tocar na chave não fecha o popup; `Esc` fecha (testes)
- [ ] A chave anuncia nome e estado por extenso (teste por papel/nome
      acessível)
- [ ] `docs/interface.md`, `docs/modelo-firebase.md` e `AGENTS.md`
      atualizados nas seções indicadas

## Validação adicional
Conferir contra o emulador que a escrita real da nova função passa nas
regras da Tarefa 0027-0001: `npm run dev` com `VITE_USE_FIREBASE_EMULATOR`,
login no emulador, ligar e desligar a chave e abrir `/catalogo/<uid>` numa
janela anônima; sem ambiente, verificação `pendente` com este roteiro.
