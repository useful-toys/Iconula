<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0037-0004: Documentação viva da página de estatísticas

## Data
2026-09-18

## Resumo
A página de estatísticas entrou na documentação de referência. Em
`docs/arquitetura.md` § Camadas no cliente, a linha de `src/lib/` passou a
citar `estatisticas.js` (derivação pura dos cinco blocos) e a de
`src/components/` a citar `Estatisticas.jsx` (vista interna de estatísticas);
a linha de `src/App.jsx` deixou de dizer só "vistas internas (política e
termos)" e passou a incluir as estatísticas. Em § Decisões-chave e onde vivem,
a tabela ganhou duas linhas — [IDR 0072](../idr/0072-pagina-de-estatisticas-como-vista-interna.md)
e [TDR 0030](../tdr/0030-graficos-de-estatisticas-a-mao-sem-biblioteca.md) —,
com o TDR na ordem numérica dos demais e o IDR junto dos outros IDRs. Em
`AGENTS.md` § Onde fica cada coisa, a tabela ganhou a linha de
`src/lib/estatisticas.js` e a de `src/components/Estatisticas.jsx`, e a linha
de `src/App.jsx` passou a listar as estatísticas entre as vistas internas —
observação que vinha das tarefas anteriores (Fase 0037) e que esta tarefa
fecha. Nenhum arquivo de código foi alterado; a documentação descreve o que as
Tarefas 0037-0001 a 0037-0003 entregaram, com lastro no IDR 0072 e no TDR 0030.

## Discovery
- Código: não se aplica a alteração de código; conferi `src/lib/estatisticas.js`
  (`derivarEstatisticas` e os cinco blocos), `src/components/Estatisticas.jsx`
  (vista interna, prop `{ contagens, onVoltar }`) e o estado `vistaInterna` em
  `src/App.jsx`, para descrever os trechos com o texto real. Nada divergente.
- Documentação: li o IDR 0072 (vista interna, botão no cabeçalho, conteúdo) e o
  TDR 0030 (gráficos à mão), o `docs/arquitetura.md` (íntegro, para posicionar
  as citações e as linhas nos índices) e a seção de `AGENTS.md`; as referências
  bastaram. Busquei as menções a "vistas internas" para achar as linhas que
  ficariam desatualizadas.

## Plano da alteração
1. `docs/arquitetura.md` § Camadas no cliente: citar `estatisticas.js` na linha
   de `src/lib/` e `Estatisticas.jsx` na de `src/components/`; alinhar a linha
   de `src/App.jsx` (vistas internas).
2. `docs/arquitetura.md` § Decisões-chave: acrescentar as linhas de IDR 0072 e
   TDR 0030, cada uma citando o registro por link relativo.
3. `AGENTS.md` § Onde fica cada coisa: acrescentar as linhas de
   `src/lib/estatisticas.js` e `src/components/Estatisticas.jsx`; incluir as
   estatísticas na linha de `src/App.jsx`.
4. Atualizar o status da tarefa e a linha no `docs/plano/README.md`.
- Verificação prevista: critério 1 → leitura do trecho e busca por
  `estatisticas.js`/`Estatisticas.jsx`; critério 2 → busca pelas linhas de IDR
  0072/TDR 0030 e dos dois módulos em `AGENTS.md`; critério 3 → links relativos
  existentes (os arquivos de registro estão no repositório) e
  `git diff --name-only` só com documentação; `npm run lint && npm run test &&
  npm run build` verdes.
- Riscos: nenhum de comportamento — a alteração é só documental; o build não
  toca esses `.md`.
- Desvios: acrescentei às citações a linha de `src/App.jsx` (vistas internas)
  em `docs/arquitetura.md` e em `AGENTS.md`, além das linhas de módulo pedidas;
  a observação das tarefas anteriores mandava atualizar a linha de `App.jsx` do
  `AGENTS.md` nesta tarefa, e deixá-la desatualizada contradiria o estado real
  que § Camadas no cliente passa a descrever.

## Decisões tomadas
- Inclusão das estatísticas nas linhas de `src/App.jsx` (vistas internas) e dos
  módulos no mesmo padrão de texto das linhas vizinhas — nível 1, sem mudar
  decisão documentada; lastro no IDR 0072 e no TDR 0030.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
> oxlint
(sem saída — sem avisos ou erros)

$ npm run test
 Test Files  57 passed (57)
      Tests  738 passed (738)

$ npm run build
✓ built in 857ms
(!) Some chunks are larger than 500 kB after minification — aviso
pré-existente (registrado em logs de fases anteriores), sem relação com
esta tarefa.
```

## Critérios de aceite
- [x] `docs/arquitetura.md` cita `estatisticas.js` e `Estatisticas.jsx` —
      linhas de `src/lib/` e `src/components/` em § Camadas no cliente.
- [x] `docs/arquitetura.md` tem linhas para IDR 0072 e TDR 0030 no índice de
      decisões — § Decisões-chave e onde vivem.
- [x] `AGENTS.md` tem as linhas de `src/lib/estatisticas.js` e
      `src/components/Estatisticas.jsx` — § Onde fica cada coisa.
- [x] Links relativos válidos; nenhum arquivo de código alterado —
      `git diff --name-only` só com `.md`.

## Arquivos alterados
- `docs/arquitetura.md` — § Camadas no cliente e § Decisões-chave com a página
  de estatísticas e os registros IDR 0072/TDR 0030.
- `AGENTS.md` — § Onde fica cada coisa com `estatisticas.js`,
  `Estatisticas.jsx` e as estatísticas na linha de `App.jsx`.
- `docs/plano/0037-pagina-de-estatisticas/0004-documentacao-viva.md` — status.
- `docs/plano/README.md` — status da tarefa.
