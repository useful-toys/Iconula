<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0033-0004: Indicador "não salvo" no título

## Data
2026-09-18

## Resumo
Enquanto existe alteração de contagem ainda não gravada, o relógio do título
(`… · 12:34`) passa a exibir "não salvo". Antes, o título só mostrava o
`updatedAt` (ou `—`), e a única leitura de "há coisa não gravada" era o
`temPendencia()` interno de `gravacaoAgregada.js`, não reativo. Agora
`App.jsx` mantém um estado `pendente`, ligado em `aplicarAjuste` e desligado
no callback `aoConcluir` (sucesso); a falha não o limpa, coerente com o
[IDR 0027](../idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md).
`Cabecalho.jsx` recebe a prop `naoSalvo` e troca o texto e o nome acessível.
`docs/interface.md` § Cabeçalho descreve o estado.

## Discovery
- Código:
  - `App.jsx` mantém `atualizadoEm` em `useState` (linha 96). A gravação
    agregada é criada no inicializador preguiçoso do `useState` (linhas
    159-189), com `aoConcluir` movendo o relógio (`formatarCarimbo`) e
    `aoFalhar` emitindo o aviso; `aoConcluir`/`aoFalhar` só recebem o
    resultado, sem acesso a estado. O ponto comum de todo ajuste de contagem
    é `aplicarAjuste` (`useCallback`, linhas 391-400), usado por
    `handleAjustar` (toque no cartão) e `handleDesfazer` — logo marcar ali
    cobre os dois caminhos.
  - `gravacaoAgregada.js` já expõe `temPendencia()`, mas sem reatividade
    (não notifica o React); a tarefa pede estado próprio no `App.jsx`.
  - `Cabecalho.jsx` monta `relogio = atualizadoEm ?? '—'` (linha 66) e o
    nome acessível com `atualizado às ${relogio}` (linha 73); `/catalogo/<uid>`
    usa o mesmo componente via `CatalogoCompartilhado.jsx` (linha 171), sem
    pendência de gravação.
  - Testes da área: `Cabecalho.test.jsx` cobre o relógio (linhas 22-56) e o
    nome acessível; `App.gravacao.test.jsx` usa temporizador falso, mocka
    `colecaoRemota` e o `Catalogo`, e já verifica "gravação bem-sucedida move
    o relógio" (linhas 174-186) e a política de erro. É o lar natural dos
    testes de integração do indicador.
  - Comportamento atual confere com a tarefa. Impactos não citados: o fluxo de
    importação (`handleImportar`, `App.jsx:685`) chama
    `gravacaoAgregada.descartarPendencias()` e grava a coleção inteira por
    `gravarImportacao`, fora da gravação agregada — se não limpar `pendente`
    ali, o indicador fica preso em "não salvo" mesmo com a coleção recém
    gravada.
- Documentação:
  - `docs/idr/0027` § Decisão define o texto "não salvo", o estado único
    (sem distinguir debounce de gravação em voo) e que `atestadoEm` não mexe
    no indicador.
  - `docs/idr/0065` confirma que nenhum `beforeunload`/popup é adicionado.
  - `docs/interface.md` § Cabeçalho (linhas 35-43) descreve o relógio e o
    `updatedAt`, sem o estado de pendência — é o trecho a atualizar.

## Plano da alteração
1. `src/App.jsx` — `const [pendente, setPendente] = useState(false)` junto de
   `atualizadoEm`; `setPendente(true)` em `aplicarAjuste`; `setPendente(false)`
   no `aoConcluir` da gravação agregada (sucesso). Passar `naoSalvo={pendente}`
   ao `Cabecalho`.
2. `src/App.jsx` — no sucesso da importação, `setPendente(false)` junto de
   `setAtualizadoEm`, porque a importação descarta as pendências e grava a
   coleção inteira (decisão de nível 2, abaixo).
3. `src/components/Cabecalho.jsx` — prop `naoSalvo` (default `false`); o
   relógio vira `naoSalvo ? 'não salvo' : (atualizadoEm ?? '—')` e o nome
   acessível perde o "atualizado às" quando pendente.
4. `src/components/Cabecalho.test.jsx` — testes do texto "não salvo", do nome
   acessível e da volta ao relógio sem a prop.
5. `src/App.gravacao.test.jsx` — testes de integração: ajuste mostra "não
   salvo" até a gravação confirmar; falha mantém "não salvo"; sucesso volta ao
   relógio; nome acessível reflete "não salvo" pendente.
6. `docs/interface.md` § Cabeçalho — descreve o estado "não salvo", citando o
   IDR 0027.
7. Status, README e este log no mesmo commit.
- Verificação prevista:
  - critério 1 → `App.gravacao.test.jsx` (ajuste → "não salvo"; após o
    debounce → relógio);
  - critério 2 → `App.gravacao.test.jsx` com gravação em erro (continua "não
    salvo");
  - critério 3 → `App.gravacao.test.jsx` e `Cabecalho.test.jsx` (sem a prop,
    relógio);
  - critério 4 → `Cabecalho.test.jsx` e `App.gravacao.test.jsx`
    (`getByLabelText` com "não salvo");
  - critério 5 → leitura de `docs/interface.md`;
  - lint/test/build.
- Riscos: os testes de `App.gravacao.test.jsx` usam temporizador falso e
  `formatarCarimbo` mockado; o novo estado não altera a temporização. O
  `Cabecalho` é compartilhado com a vista do link, mas a prop é opcional.
- Desvios: nenhum.

## Decisões tomadas
- Limpar `pendente` também no sucesso da importação, além do `aoConcluir` da
  gravação agregada — a importação chama `gravacaoAgregada.descartarPendencias()`
  e grava a coleção inteira por `gravarImportacao`, fora da gravação agregada;
  sem isso, um ajuste não gravado seguido de importação deixaria o título preso
  em "não salvo" mesmo com a coleção recém-gravada. Premissa: o indicador
  acompanha a existência real de alteração por gravar. Nível 2, sinalizada no
  relatório.
- Texto do nome acessível quando pendente é exatamente "não salvo", no lugar
  de "atualizado às não salvo" — opção sugerida na tarefa ("algo equivalente").
  Nível 1.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
`npm run lint` — exit 0, sem avisos nem erros (nesta versão do oxlint a
saída limpa não imprime o resumo; conferido o código de saída).

`npm run test` — 50 arquivos, 659 testes, todos passando (eram 654; +5 dos
testes novos: 2 em `Cabecalho.test.jsx`, 3 em `App.gravacao.test.jsx`).
Trecho final:

```
 Test Files  50 passed (50)
      Tests  659 passed (659)
```

`npx vitest run src/components/Cabecalho.test.jsx src/App.gravacao.test.jsx
--reporter=verbose` — 32 testes, incluindo os novos: "troca o relógio por
\"não salvo\" com a prop", "sem a prop, mantém o relógio e o nome acessível de
atualização", "mostra \"não salvo\" após o ajuste e volta ao relógio quando a
gravação confirma", "uma falha de gravação mantém \"não salvo\" sem voltar ao
relógio antigo" e "o nome acessível do título reflete \"não salvo\" enquanto
pende".

`npm run build` — 146 módulos, "✓ built in 660ms"; o aviso de chunk acima de
500 kB é pré-existente.

`npm run test:rules` — não se aplica (não tocou `firestore.rules`).

## Critérios de aceite
- [x] Após qualquer ajuste de contagem, o título mostra "não salvo" até a
      gravação seguinte confirmar sucesso — `src/App.gravacao.test.jsx`,
      "mostra \"não salvo\" após o ajuste e volta ao relógio quando a gravação
      confirma": após `onAjustar("BRA01", 1)` o texto é "não salvo" e, depois
      de `advanceTimersByTimeAsync(2000)`, é "10:00".
- [x] Uma falha de gravação mantém "não salvo" (não volta ao relógio antigo)
      — `src/App.gravacao.test.jsx`, "uma falha de gravação mantém \"não
      salvo\" sem voltar ao relógio antigo": documento com `updatedAt` que
      rende "10:00", `gravarAlteracoes` em erro; após o debounce continua
      "não salvo", sem "10:00", com o `alert` de falha na tela.
- [x] Sem pendência, o relógio volta a mostrar `updatedAt` normalmente —
      mesmo teste do primeiro critério (após o sucesso, "10:00") e
      `src/components/Cabecalho.test.jsx`, "sem a prop, mantém o relógio e o
      nome acessível de atualização" ("12:34").
- [x] O nome acessível do título reflete "não salvo" quando pendente —
      `src/App.gravacao.test.jsx`, "o nome acessível do título reflete \"não
      salvo\" enquanto pende" (`getByLabelText(/não salvo/)` após o ajuste e
      `/atualizado às 10:00/` após o sucesso); `src/components/Cabecalho.test.jsx`,
      "troca o relógio por \"não salvo\" com a prop".
- [x] `docs/interface.md` § Cabeçalho descreve o estado "não salvo", citando
      o IDR 0027 — bullet "O relógio do título é o `updatedAt` do documento"
      (`docs/interface.md:40-46`) passa a dizer que o relógio dá lugar a "não
      salvo" enquanto há alteração não gravada, com links para o IDR 0027 e o
      IDR 0065.

## Arquivos alterados
- `src/App.jsx` — estado `pendente`, `setPendente(true)` em `aplicarAjuste`,
  `setPendente(false)` no `aoConcluir` e no sucesso da importação, prop
  `naoSalvo` ao `Cabecalho`.
- `src/components/Cabecalho.jsx` — prop `naoSalvo` (default `false`), texto do
  relógio e nome acessível alternativos, JSDoc.
- `src/components/Cabecalho.test.jsx` — dois testes novos do indicador.
- `src/App.gravacao.test.jsx` — três testes novos de integração.
- `docs/interface.md` — § Cabeçalho, bullet do relógio.
- `docs/plano/0033-.../0004-indicador-nao-salvo-no-titulo.md` — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0033-.../logs/0004-log-indicador-nao-salvo-no-titulo.md` —
  este log.

