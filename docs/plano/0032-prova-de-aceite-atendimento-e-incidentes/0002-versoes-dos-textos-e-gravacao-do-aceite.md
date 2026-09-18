<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0032-0002]: versões dos textos e gravação do aceite

## Status
Pendente

## Objetivo

Dar às versões dos textos um lugar único no código e transformar a
gravação da atestação na gravação do aceite, que registra qual versão a
conta aceitou e quando.

## Documentos de referência

- `docs/model-dr/0009-campos-de-aceite-dos-textos.md` § Decisão — o que
  cada função grava e o que a carga devolve.
- `docs/idr/0062-reaceite-reusa-a-tela-de-atestacao.md` § Decisão — a
  regra de mudança material, que o módulo de versões documenta.
- `docs/modelo-firebase.md` § Mecanismo de gravação — as quatro funções
  de escrita, que passam a ser descritas com a renomeada.

## Padrões e convenções aplicáveis

- `colecaoRemota.js` nunca lança e devolve resultado discriminado.
- A gravação do aceite fica fora da gravação agregada e não carimba
  `updatedAt`.
- Uma leitura por login: a carga continua sendo uma só, agora
  devolvendo mais campos.

## Escopo e instruções de implementação

1. Criar `src/lib/versoesDosTextos.js` com as duas versões (data de
   vigência em ISO) e, no JSDoc, a regra de que só mudança material as
   altera.
2. Em `src/lib/colecaoRemota.js`, renomear a gravação da atestação para
   a gravação do aceite, com um parâmetro que diz se a atestação de
   idade acompanha; gravar as duas versões e o instante do aceite com
   `merge`, sem `updatedAt`.
3. Fazer a carga devolver as duas versões junto com `atestadoEm`.
4. Ajustar `src/App.jsx` e os testes existentes que chamam a função
   antiga, mantendo o comportamento atual do primeiro acesso.
5. Atualizar `docs/modelo-firebase.md` § Mecanismo de gravação e a
   tabela § Operações sobre o documento com a função renomeada; e
   `AGENTS.md` § Onde fica cada coisa com o módulo novo e a descrição
   de `colecaoRemota.js`.

**Fora do escopo**: decidir quando reabrir a tela (Tarefa 0032-0003); o
texto do histórico de versões (Tarefa 0032-0004).

## Decisões já tomadas (não reabrir)

- Data ISO como versão, campos gravados juntos e sem `updatedAt` — ver
  `docs/model-dr/0009-campos-de-aceite-dos-textos.md`.
- Só mudança material sobe a versão — ver
  `docs/idr/0062-reaceite-reusa-a-tela-de-atestacao.md`.

## Arquivos impactados

- `src/lib/versoesDosTextos.js` — criar
- `src/lib/colecaoRemota.js` — modificar
- `src/lib/colecaoRemota.test.js` — modificar
- `src/App.jsx` — modificar
- `src/App.atestacao.test.jsx` — modificar
- `docs/modelo-firebase.md` — modificar (§ Mecanismo de gravação,
  § Operações sobre o documento)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite

- [ ] As duas versões existem num módulo só, com a regra de mudança
      material documentada
- [ ] A gravação do aceite grava as duas versões e o instante, e só
      inclui a atestação quando pedida
- [ ] Nenhuma gravação de aceite carimba `updatedAt` (verificável por
      teste)
- [ ] A carga devolve as duas versões
- [ ] Nenhuma referência ao nome antigo da função resta em `src/`
      (verificável por busca)
- [ ] `npm run lint && npm run test && npm run build` verdes
