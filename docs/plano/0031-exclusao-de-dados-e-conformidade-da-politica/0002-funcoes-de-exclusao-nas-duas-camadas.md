<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0031-0002]: funções de exclusão nas duas camadas

## Status
Pendente

## Objetivo

Expor, em cada módulo que já é dono do seu SDK, as três operações que a
exclusão precisa: apagar o documento no Firestore, reautenticar por
popup e apagar a conta no Auth. Sem interface — só a camada que a
Tarefa 0031-0003 vai orquestrar.

## Documentos de referência

- `docs/tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md` § Decisão —
  quais funções existem e o que cada uma faz.
- `docs/adr/0005-persistencia-no-firestore.md` — o SDK do Firestore é
  carregado sob demanda e só `colecaoRemota.js` o toca.
- `docs/adr/0004-login-google-sdk-modular.md` — API modular do Auth e
  popup obrigatório.
- `docs/arquitetura.md` §§ Serviços Firebase, Camadas no cliente — o que
  passa a descrever as operações novas.

## Padrões e convenções aplicáveis

- `colecaoRemota.js` **nunca lança**: toda função devolve resultado
  discriminado (`sucesso` | `erro` | `indisponivel`), com guarda de
  `app` nulo no topo e `mensagemDeErro` que não expõe uid nem coleção.
- `firebase.js` **lança** e quem chama traduz — é o estilo de
  `signInWithGoogle()`, tratado em `LoginButton.jsx`.
- `firebase.js` não importa `firebase/firestore`; `colecaoRemota.js`
  importa o SDK dinamicamente.
- Teste co-localizado por módulo (ADR 0009).

## Escopo e instruções de implementação

1. Em `src/lib/colecaoRemota.js`, acrescentar uma função que apaga o
   documento `users/{uid}`, com a mesma assinatura e o mesmo contrato de
   resultado das demais, aceitando o callback de espera e usando o
   auxiliar de corrida com tempo-limite já existente.
2. Em `src/lib/firebase.js`, acrescentar duas funções irmãs de
   `signInWithGoogle()`: uma que reautentica o usuário corrente por
   popup do Google e outra que apaga a conta corrente. Importar da API
   modular apenas o que for necessário.
3. Cobrir com testes co-localizados: sucesso, erro do SDK e o caso de
   `app`/`auth` indisponível, seguindo o padrão de mock já usado nos
   testes desses dois módulos.
4. Atualizar `docs/arquitetura.md`: § Serviços Firebase passa a citar a
   exclusão de conta como operação do Auth usada pelo app, e § Camadas
   no cliente descreve as funções novas nas duas camadas.
5. Atualizar `AGENTS.md` § Onde fica cada coisa: as linhas de
   `src/lib/firebase.js` e `src/lib/colecaoRemota.js` passam a mencionar
   as operações novas.

**Fora do escopo**: a orquestração da ordem, os avisos e o descarte de
pendências (Tarefa 0031-0003); qualquer componente ou texto de tela.

## Decisões já tomadas (não reabrir)

- A reautenticação é sempre por popup e acontece antes de apagar
  qualquer coisa; a ordem completa é da Tarefa 0031-0003 — ver
  `docs/tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md`.
- Popup é obrigatório para este projeto (não `redirect`) — ver
  `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md` e o
  comentário de `LoginButton.jsx`.

## Arquivos impactados

- `src/lib/colecaoRemota.js` — modificar
- `src/lib/colecaoRemota.test.js` — modificar
- `src/lib/firebase.js` — modificar
- `src/lib/firebase.test.js` — criar (hoje o módulo não tem teste
  co-localizado)
- `docs/arquitetura.md` — modificar (§ Serviços Firebase, § Camadas no
  cliente)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite

- [ ] A função de apagar o documento devolve resultado discriminado e
      nunca lança, inclusive com `app` indisponível
- [ ] As funções de reautenticar e apagar conta vivem em
      `src/lib/firebase.js` e usam a API modular
- [ ] `src/lib/firebase.js` continua sem importar `firebase/firestore`
      (verificável por busca no arquivo)
- [ ] Testes cobrem sucesso, erro e indisponível para cada função nova
- [ ] `docs/arquitetura.md` e `AGENTS.md` descrevem as operações novas,
      citando o TDR 0027
- [ ] `npm run lint && npm run test && npm run build` verdes
