<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0028-0001: notação `▯`/`×` sem `·` no placar e no super-grupo

## Data
2026-09-17

## Resumo
O placar do cabeçalho e o título do super-grupo passam a usar a notação
compacta nova: o glifo de faltantes vira `▯` (retângulo vertical) e os `·`
entre os campos de progresso (coladas/total, percentual, faltantes,
repetidas) somem; os `·` estruturais continuam — entre `ICONULA 2026` e o
placar, entre o placar e o relógio, e entre `Grupo C` e o resumo. Antes:
`ICONULA 2026 · 412/994 · 41% · ▢582 · ×37 · 12:34` e
`Grupo C · 34/80 · 43% · ▢46 · ×12`; depois: `ICONULA 2026 · 412/994 41%
▯582 ×37 · 12:34` e `Grupo C · 34/80 43% ▯46 ×12`.

O espaçamento não muda: `.cabecalho__titulo` e `.super-grupo__titulo-botao`
são `display: flex` com `gap: 0.35em`, então cada campo continuou separado
por `0.35em` mesmo sem o span do `·`; nenhum CSS foi tocado. O `×` de
repetidas e o nome acessível por extenso ("N faltantes, N repetidas")
seguem intactos.

Arquivos: `Cabecalho.jsx` e `SuperGrupo.jsx` (glifo e remoção dos
separadores), `Cabecalho.test.jsx` e `SuperGrupo.test.jsx` (asserção da
sequência contígua, sem `·` entre os campos) e `docs/interface.md`
(§ Cabeçalho, § Corpo e a linha do placar no wireframe). Divergências: a
Tarefa 0028-0002 ainda muda a mesma notação na seção e no tooltip da faixa;
as ocorrências do wireframe e do texto de § Corpo ligadas à **seção** foram
deixadas para ela.

## Discovery
- Código: `Cabecalho.jsx` monta o placar num `<h1 class="cabecalho__titulo">`
  (`display: flex; gap: 0.35em`) com um span por campo e `.cabecalho__sep`
  (`·`) entre **todos** eles; `▢` é um span próprio antes do número de
  faltantes. `SuperGrupo.jsx` repete a estrutura em
  `.super-grupo__titulo-botao` (também `display: flex; gap: 0.35em`), com o
  `·` entre nome e resumo. Como o espaçamento vem do `gap` do flex, remover
  os spans de `·` entre os campos **não muda o CSS**: os itens continuam
  separados por `0.35em`. Nenhum consumidor além de `App.jsx` e
  `CatalogoCompartilhado.jsx` usa `Cabecalho`; `Catalogo.jsx` usa
  `SuperGrupo`. Comportamento atual confere com a tarefa.
- Testes da área: `Cabecalho.test.jsx` (linhas 37 e 77 afirmam `▢`), e
  `SuperGrupo.test.jsx` (linha 141 afirma `▢77`). A asserção da linha 319 de
  `Cabecalho.test.jsx` é o texto do **tooltip da faixa**, que esta tarefa não
  toca (Tarefa 0028-0002) e segue verde.
- Documentação: a decisão já está registrada no
  `docs/idr/0018-usuario-especialista-e-minimalismo.md` (§ Decisão e
  § Histórico) e o requisito em `docs/requisitos.md` § UX — ambos já com a
  notação nova, gravados no planejamento. `interface.md` § Cabeçalho e § Corpo
  ainda traziam `▢` e os `·` entre campos; o wireframe também trazia o placar
  antigo. Nenhum registro novo a criar.

## Plano da alteração
1. `Cabecalho.jsx` — trocar `▢` por `▯`; remover os `.cabecalho__sep` entre
   coladas/total, percentual, faltantes e repetidas; manter os `·`
   estruturais (nome↔placar e placar↔relógio); atualizar o JSDoc.
2. `SuperGrupo.jsx` — a mesma troca e remoção no título do super-grupo,
   mantendo o `·` entre `Grupo X` e o resumo.
3. `Cabecalho.test.jsx` — `▢` → `▯` e afirmação da sequência contígua sem `·`
   entre os campos; `SuperGrupo.test.jsx` — `▢77` → `▯77` e a sequência.
4. `docs/interface.md` — § Cabeçalho (título), § Corpo (super-grupo) e a linha
   do placar no wireframe, com lastro no IDR 0018.
5. Log, status `Concluída` no arquivo e no README e commit único.
- Verificação prevista: placar → teste que afirma o texto do `<h1>` sem `·`
  entre os campos; super-grupo → teste que afirma o texto do título;
  nome acessível → teste existente por extenso; lint/test/build.
- Riscos: o `textContent` pode trazer espaços inesperados; confirmar na
  primeira execução dos testes. Nenhuma mudança de CSS é prevista.
- Desvios: incluída a linha do **placar** no wireframe de `interface.md`
  (a tarefa cita só § Cabeçalho e § Corpo) para o documento não ficar com
  duas notações de placar; as ocorrências de **seção** e de **tooltip** do
  wireframe ficam para a Tarefa 0028-0002, conforme o "Fora do escopo". No
  teste do placar foi acrescentado `atualizadoEm="12:34"` para casar a
  string do critério de aceite.

## Decisões tomadas
- Incluir a linha do placar no wireframe de `interface.md` — nível 1
  (consistência documental, mesma mudança, mesmo arquivo); sem registro
  próprio, lastro no IDR 0018. Motivo no plano (Desvios).

## Impedimentos
Nenhum

## Setup realizado
Nenhum

## Validação
- `npm run lint` — `Found 0 warnings and 0 errors.` (89 arquivos, 105 regras).
- `npm run test` — `43 passed (43)` arquivos, `581 passed (581)` testes.
- `npm run build` — `✓ built in 459ms`, exit 0; permanece só o aviso
  pré-existente de chunk > 500 kB do Vite.

## Critérios de aceite
- [x] Placar exibe `ICONULA 2026 · 412/994 41% ▯582 ×37 · 12:34` — sem `·`
      entre os campos de progresso e `▯` no faltante — evidência:
      `Cabecalho.test.jsx` "renderiza o título com a notação compacta" afirma
      `textContent` contíguo `ICONULA 2026·412/99441%▯582×37·12:34` (só os `·`
      estruturais restam); `npm run test` verde.
- [x] Super-grupo exibe `Grupo C · 34/80 43% ▯46 ×12` — evidência:
      `SuperGrupo.test.jsx` "calcula o progresso agregado sobre os 80 códigos
      do grupo" afirma `Grupo C·3/804%▯77×2` (mesmo formato, só o `·` entre
      nome e resumo); `npm run test` verde.
- [x] Nome acessível continua por extenso ("… faltantes, … repetidas") —
      evidência: `Cabecalho.test.jsx` "escreve o nome acessível por extenso"
      e `SuperGrupo.test.jsx` "inclui o estado de colapso no nome acessível",
      ambos verdes.
- [x] `npm run lint && npm run test && npm run build` verdes — evidência na
      seção Validação.

## Arquivos alterados
- `src/components/Cabecalho.jsx` — `▢` → `▯`, remoção dos `·` entre os campos
  de progresso do placar e JSDoc atualizado.
- `src/components/SuperGrupo.jsx` — `▢` → `▯` e remoção dos `·` entre os
  campos do resumo do super-grupo.
- `src/components/Cabecalho.test.jsx` — asserção da sequência contígua do
  placar (com `atualizadoEm`), `▢994` → `▯994`.
- `src/components/SuperGrupo.test.jsx` — asserção da sequência contígua do
  título do super-grupo.
- `docs/interface.md` — § Cabeçalho (título), § Corpo (super-grupo) e linha do
  placar no wireframe (§ Wireframe) e a menção do placar na legenda.
- `docs/plano/0028-notacao-compacta-e-titulo-de-secao/0001-notacao-no-placar-e-no-super-grupo.md`
  — status `Concluída`.
- `docs/plano/README.md` — linha da tarefa `Concluída`.
