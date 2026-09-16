<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0027-0002]: catálogo e cabeçalho em somente leitura

## Status
Pendente

## Objetivo
Preparar os componentes da tela principal para a vista do link: sem
callback de ajuste, os cartões não reagem, não são botões e saem da ordem
de tabulação; o catálogo pode ler o colapso manual sem gravá-lo; o
cabeçalho aceita o rótulo "somente leitura" e o título como link. A tela
principal atual não muda — a vista que usa isto nasce na Tarefa 0027-0003.

## Documentos de referência
- `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
  § Decisão — "Vista = tela principal sem edição", cartões sem papel de
  botão, rótulo e título como link para `/`, preferências lidas e não
  gravadas
- `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
  § Decisão — colapso manual no `localStorage`; leitura sem gravação na
  vista do link
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — linha
  única do título e nome acessível por extenso
- `docs/tdr/0021-desempenho-do-catalogo.md` § Decisão — memoização e
  comparação de props
- `src/components/Figurinha.jsx`, `Secao.jsx`, `SuperGrupo.jsx`,
  `PaginaDoAlbum.jsx`, `Catalogo.jsx`, `Cabecalho.jsx` e os testes ao lado
- `src/lib/colapsoManual.js`
- `docs/interface.md` § Cabeçalho, § Figurinha, § Interações

## Padrões e convenções aplicáveis
- Memoização de `Secao`/`SuperGrupo`/`Figurinha` preservada: a ausência do
  callback não pode quebrar a comparação de props — TDR 0021
- Cor nunca é o único sinal; o nome acessível do cartão continua dizendo
  código, nome e contagem — requisitos.md § Requisitos Não Funcionais,
  IDR 0018
- Rótulo sem quebrar a linha única do título no celular além do que o
  IDR 0018 já prevê — IDR 0018
- Sem rolagem própria em nenhum componente — IDR 0008

## Escopo e instruções de implementação
1. `Figurinha.jsx` (+ `.css` se preciso): sem `onIncrementar`, o cartão é
   renderizado sem papel de botão, fora da ordem de tabulação, sem controle
   de menos, sem pressão longa e sem retorno de toque; aparência de estado
   (cor, selo `×N`, metalizada, nome) igual; nome acessível preservado.
2. `Secao.jsx`, `SuperGrupo.jsx`, `PaginaDoAlbum.jsx`, `Catalogo.jsx`:
   `onAjustar` passa a ser opcional e, ausente, não chega aos cartões como
   funções de ajuste; colapso de seções e super-grupos e o salto continuam
   funcionando.
3. `Catalogo.jsx`: modo em que o colapso manual é lido de
   `colapsoManual.js` na abertura, muda em memória, mas não é gravado (a
   forma da prop é da execução, nível 1).
4. `Cabecalho.jsx` (+ `.css`): prop opcional que acrescenta, no fim da linha
   do título, o rótulo `somente leitura` em `--muted`, também no nome
   acessível; prop opcional que torna `ICONULA 2026` um link para `/`. Sem
   as props, o cabeçalho é idêntico ao atual.
5. Testes nos arquivos ao lado de cada componente: cartão sem callback não
   é botão, não recebe foco por `Tab`, não reage a clique nem a pressão
   longa e mantém o nome acessível; catálogo sem `onAjustar` renderiza nas
   duas disposições; colapso lido e não gravado no modo novo; cabeçalho com
   rótulo e link; tela principal (`App` existente) inalterada.

**Fora do escopo**: ler o caminho `/catalogo/<uid>` e montar a vista
(Tarefa 0027-0003); textos de `interface.md` sobre a vista (Tarefa
0027-0003); qualquer mudança visível na tela principal atual.

## Decisões já tomadas (não reabrir)
- Vista = tela principal sem edição; cartões sem papel de botão e fora da
  tabulação; rótulo `somente leitura`; título como link para `/` — ver
  `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
- Preferências e colapso lidos, não gravados, na vista do link — ver
  `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
- Memoização e `content-visibility` do catálogo — ver
  `docs/tdr/0021-desempenho-do-catalogo.md`

## Decisões em aberto nesta tarefa
- Elemento e atributos do cartão inerte (ex.: `div` com `role="img"` ou
  texto com o nome acessível) — nível 1; registrar no log.

## Arquivos impactados
- `src/components/Figurinha.jsx`, `src/components/Figurinha.test.jsx` —
  modificar; `src/components/Figurinha.css` — modificar, se preciso
- `src/components/Secao.jsx`, `src/components/Secao.test.jsx` — modificar
- `src/components/SuperGrupo.jsx`, `src/components/SuperGrupo.test.jsx` —
  modificar
- `src/components/PaginaDoAlbum.jsx`,
  `src/components/PaginaDoAlbum.test.jsx` — modificar
- `src/components/Catalogo.jsx`, `src/components/Catalogo.test.jsx` —
  modificar
- `src/components/Cabecalho.jsx`, `src/components/Cabecalho.test.jsx`,
  `src/components/Cabecalho.css` — modificar

## Critérios de aceite
- [ ] Cartão sem callback não é botão, não entra na ordem de tabulação, não
      mostra o menos e não reage a clique nem a pressão longa, com nome
      acessível igual ao do cartão editável (testes)
- [ ] Catálogo sem `onAjustar` renderiza nas disposições lista e álbum,
      com colapso e salto funcionando (testes)
- [ ] No modo sem gravação, alternar o colapso não chama
      `gravarColapsoManual` (teste)
- [ ] Cabeçalho com as props mostra `somente leitura` e o título como link
      para `/`; sem as props, a marcação é a atual (testes)
- [ ] Testes existentes de `App` e dos componentes verdes, sem alteração de
      comportamento da tela principal
